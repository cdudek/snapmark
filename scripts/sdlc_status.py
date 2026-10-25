"""Where a change stands, in one verb: for the session name and the status line.

    python3 scripts/sdlc_status.py set <id>|- <Verb> [item ...] [--agents a,b] [--progress 2/5] [--note text]
    python3 scripts/sdlc_status.py name [<id>]   # prints the session name
    python3 scripts/sdlc_status.py line          # status-line segment; stdin is the status-line JSON
    python3 scripts/sdlc_status.py map [<id>]    # every milestone, and every feature of this one

Written by `sdlc-run adopt` from the kit; edit the kit, not this copy. stdlib only.

`set` writes <changesDir>/<id>/status.json (gitignored); `set -` (before a change folder exists,
Stage 1.0) writes sdlc-status.json in this worktree's git dir, and the first `set <id>` removes it.
The verb is from VERBS, a closed list, so the same state always reads the same. The status line
updates on its own.

The stage (1-7) is read from the files, never passed in: lock.json → 5 (6 once every feature is
merged), plan.md → 4, facts.md → 3, an approved intent → 2, otherwise 1; Archiving and Measuring
are 7.

Where the numbers come from: milestone position from the design doc's `## Milestones` list
(decisions.json `design`), features from the milestone's `milestone.md` Features table.
"""

from __future__ import annotations

import datetime as dt
import json
import re
import subprocess
import sys
from pathlib import Path

# verb -> the status line's ANSI colour, which says whose move it is.
VERBS = {
    "Preparing": "38;5;245",
    "Drafting": "38;5;116",
    "Designing": "38;5;116",
    "Planning": "38;5;116",
    "Waiting for you": "38;5;223",
    "Building": "38;5;117",
    "Testing": "38;5;117",
    "Fixing": "38;5;117",
    "Reviewing": "38;5;183",
    "Validating": "38;5;183",
    "Checking": "38;5;183",
    "Blocked": "38;5;210",
    "Merging": "38;5;151",
    "Archiving": "38;5;151",
    "Measuring": "38;5;151",
}
SHOWN = 3  # items named before the rest are counted
STAGES = ("Intent", "UX plan", "Facts", "Tech plan", "Build", "Milestone", "Outcome")


def git(root: Path, *args: str) -> str:
    out = subprocess.run(["git", "-C", str(root), *args], capture_output=True, text=True)
    return out.stdout.strip() if out.returncode == 0 else ""


def repo_root(start: Path) -> Path | None:
    top = git(start, "rev-parse", "--show-toplevel")
    return Path(top) if top and (Path(top) / "sdlc.json").exists() else None


def config(root: Path) -> dict:
    return json.loads((root / "sdlc.json").read_text(encoding="utf-8"))


def slug_of(name: str) -> str:
    name = re.sub(r"^\d{4}-\d{2}-\d{2}-", "", name)
    return re.sub(r"^[A-Z][A-Z0-9]+-\d+-", "", name)


def read_json(path: Path) -> dict:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (OSError, ValueError):
        return {}


def loose_status(root: Path) -> Path:
    """Where `set -` keeps the status before a change folder exists: per worktree, untracked."""
    return Path(git(root, "rev-parse", "--absolute-git-dir") or root / ".git") / "sdlc-status.json"


def find_change(root: Path, cfg: dict, change_id: str | None) -> Path | None:
    base = root / cfg.get("changesDir", "changes")
    if change_id:
        return base / change_id if (base / change_id).is_dir() else None
    if not base.is_dir():
        return None
    folders = [d for d in base.iterdir() if d.is_dir() and d.name != "archive"]
    branch = git(root, "symbolic-ref", "--short", "-q", "HEAD")
    for d in sorted(folders):
        if branch and slug_of(d.name) in branch:
            return d
    with_status = [d for d in folders if (d / "status.json").exists()]
    return max(with_status, key=lambda d: (d / "status.json").stat().st_mtime, default=None)


def frontmatter(path: Path, key: str) -> str:
    if not path.exists():
        return ""
    m = re.search(rf"^{key}:\s*(.+)$", path.read_text(encoding="utf-8"), re.M)
    return m.group(1).strip() if m else ""


def section(text: str, heading: str) -> list[str]:
    m = re.search(rf"^## {re.escape(heading)}\s*$(.*?)(?=^## |\Z)", text, re.M | re.S)
    return [line for line in m.group(1).splitlines() if line.strip()] if m else []


def initiative(change: Path, root: Path, decisions: dict) -> tuple[str, int, int]:
    """(name, milestone position, milestone total); 0/0 without a design doc listing it."""
    named = decisions.get("milestone", {}).get("initiative", "")
    design = root / str(decisions.get("design", ""))
    pos = total = 0
    if decisions.get("design") not in (None, "", "none") and design.is_file():
        text = design.read_text(encoding="utf-8")
        title = re.search(r"^# (?:Design:\s*)?(.+)$", text, re.M)
        named = named or (title.group(1).strip() if title else "")
        items = [li for li in section(text, "Milestones") if re.match(r"\s*(?:[-*]|\d+\.)\s", li)]
        total = len(items)
        pos = next((i for i, li in enumerate(items, 1) if slug_of(change.name) in li), 0)
    if not named:
        plan = change / "plan.md"
        title = (
            re.search(r"^# Plan:\s*(.+)$", plan.read_text(encoding="utf-8"), re.M)
            if plan.exists()
            else None
        )
        named = title.group(1).strip() if title else slug_of(change.name).replace("-", " ")
    return named, pos, total


def features(change: Path, root: Path, cfg: dict, decisions: dict) -> list[dict]:
    """Rows of the milestone's Features table: [{id, feature, state}]."""
    milestone = change / "milestone.md"
    slug = decisions.get("milestone", {}).get("slug", "")
    if not milestone.exists() and slug:
        base = root / cfg.get("changesDir", "changes")
        milestone = next(
            (m for m in base.glob("*/milestone.md") if frontmatter(m, "milestone") == slug),
            milestone,
        )
    if not milestone.exists():
        return []
    rows = []
    for line in section(milestone.read_text(encoding="utf-8"), "Features"):
        cells = [c.strip() for c in line.strip().strip("|").split("|")]
        if len(cells) >= 5 and cells[0] not in ("#", "") and not set(cells[0]) <= {"-", ":"}:
            rows.append({"id": f"F{cells[0]}", "feature": cells[2], "state": cells[4]})
    return rows


def stage_of(change: Path | None, verb: str, rows: list[dict]) -> int:
    if verb in ("Archiving", "Measuring") or (change and "archive" in change.parts):
        return 7
    if change is None:
        return 1
    if (change / "lock.json").exists():
        return 6 if rows and all(r["state"].startswith(("merged", "done")) for r in rows) else 5
    if (change / "plan.md").exists():
        return 4
    if (change / "facts.md").exists():
        return 3
    return 2 if frontmatter(change / "intent.md", "status") == "approved" else 1


def listing(names: list[str]) -> str:
    shown = "+".join(names[:SHOWN])
    return shown + (f" +{len(names) - SHOWN}" if len(names) > SHOWN else "")


def state(change: Path | None, root: Path, cfg: dict) -> dict:
    if change is None:
        status = read_json(loose_status(root))
        decisions: dict = {}
        name, pos, total, rows = "", 0, 0, []
    else:
        status = read_json(change / "status.json")
        decisions = read_json(change / "decisions.json")
        name, pos, total = initiative(change, root, decisions)
        rows = features(change, root, cfg, decisions)
    verb = status.get("verb", "Drafting")
    return {
        "product": cfg.get("product") or root.name,
        "initiative": name,
        "pos": pos,
        "total": total,
        "hotfix": decisions.get("milestone", {}).get("kind") == "hotfix",
        "verb": verb,
        "stage": stage_of(change, verb, rows),
        "items": status.get("items", []),
        "agents": status.get("agents", []),
        "progress": status.get("progress", ""),
        "note": status.get("note", ""),
        "features": rows,
        "merged": sum(1 for r in rows if r["state"].startswith(("merged", "done"))),
    }


def session_name(s: dict) -> str:
    if s["hotfix"]:
        doing = " ".join([s["verb"], *s["items"][:1]])
        return f"{s['product']} · Hotfix {s['initiative']} · Stage {s['stage']}/7 · {doing}"
    where = s["initiative"] + (f" M{s['pos']}/{s['total']}" if s["pos"] else "")
    doing = " ".join(filter(None, [s["verb"], listing(s["items"])]))
    progress = s["progress"] or (f"{s['merged']}/{len(s['features'])}" if s["features"] else "")
    parts = [s["product"], where, f"Stage {s['stage']}/7", doing, progress and f"{progress} done"]
    return " · ".join(filter(None, parts))


def status_line(s: dict) -> str:
    colour = VERBS.get(s["verb"], "38;5;189")
    agents = f"{listing(s['agents'])} ({len(s['agents'])} agents)" if s["agents"] else ""
    stage = f"Stage {s['stage']}/7 {STAGES[s['stage'] - 1]}"
    parts = [stage, " ".join(filter(None, [s["verb"], listing(s["items"])])), s["note"], agents]
    parts.append(f"{s['progress']} done" if s["progress"] else "")
    return f"\033[{colour}m" + " · ".join(p for p in parts if p) + "\033[0m"


def milestone_map(s: dict) -> str:
    head = s["initiative"] + (f"  M{s['pos']} of {s['total']}" if s["pos"] else "")
    marks = {"merged": "✓", "done": "✓", "building": "◐", "blocked": "✗"}
    bar = "".join(
        next((v for k, v in marks.items() if r["state"].startswith(k)), "○") for r in s["features"]
    )
    lines = [head, f"  this milestone  {s['merged']} of {len(s['features'])} merged  {bar}"]
    lines += [f"    {r['id']:<4} {r['feature']:<32} {r['state']}" for r in s["features"]]
    lines.append(f"  now  {status_line(s)}")
    return "\n".join(lines)


def cmd_set(root: Path, cfg: dict, argv: list[str]) -> int:
    if len(argv) < 2:
        print(__doc__)
        return 2
    change_id, verb, rest = argv[0], argv[1].replace("-", " "), argv[2:]
    if verb not in VERBS:
        print(f"unknown verb {verb!r}; use one of: {', '.join(VERBS)}")
        return 2
    change = None if change_id == "-" else find_change(root, cfg, change_id)
    if change_id != "-" and not change:
        print(f"no change folder {change_id}")
        return 2
    path = change / "status.json" if change else loose_status(root)
    status: dict = {"verb": verb, "items": [], "agents": [], "progress": "", "note": ""}
    flags = {"--agents": "agents", "--progress": "progress", "--note": "note"}
    i = 0
    while i < len(rest):
        if rest[i] in flags and i + 1 < len(rest):
            key, value = flags[rest[i]], rest[i + 1]
            status[key] = [a for a in value.split(",") if a] if key == "agents" else value
            i += 2
        else:
            status["items"].append(rest[i])
            i += 1
    status["updated"] = dt.datetime.now(dt.timezone.utc).isoformat(timespec="seconds")
    if change and loose_status(root).exists():
        loose_status(root).unlink()
    path.write_text(json.dumps(status, indent=2) + "\n", encoding="utf-8")
    print(status_line(state(change, root, cfg)))
    return 0


def main(argv: list[str]) -> int:
    if len(argv) < 2 or argv[1] not in ("set", "name", "line", "map"):
        print(__doc__)
        return 2
    if argv[1] == "line":
        # A status line must never fail or print noise: no adopted repo, no output.
        try:
            payload = json.loads(sys.stdin.read() or "{}")
            cwd = payload.get("workspace", {}).get("current_dir") or payload.get("cwd") or "."
            root = repo_root(Path(cwd))
            change = find_change(root, config(root), None) if root else None
            if root and (change or loose_status(root).exists()):
                print(status_line(state(change, root, config(root))))
        except Exception:  # noqa: BLE001 - see above
            pass
        return 0
    root = repo_root(Path.cwd())
    if not root:
        print("no sdlc.json in this repo: run `sdlc-run adopt`")
        return 2
    cfg = config(root)
    if argv[1] == "set":
        return cmd_set(root, cfg, argv[2:])
    change = find_change(root, cfg, argv[2] if len(argv) > 2 else None)
    if not change and not loose_status(root).exists():
        print("no change folder for this branch")
        return 2
    s = state(change, root, cfg)
    if argv[1] == "map":
        print(milestone_map(s))
        return 0
    print(session_name(s))
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))

content = open("backend/seed_guidance.py", "r").read()
if "already seeded" not in content:
    content = content.replace("resources = [", "if GuidanceResource.query.first():\n        print('Guidance already seeded')\n    else:\n        resources = [")
    lines = content.split('\n')
    in_else = False
    for i, line in enumerate(lines):
        if "resources = [" in line and "else:" in lines[i-1]:
            in_else = True
        elif in_else and line.startswith("    "):
            lines[i] = "    " + line
    open("backend/seed_guidance.py", "w").write("\n".join(lines))
    print("Done!")

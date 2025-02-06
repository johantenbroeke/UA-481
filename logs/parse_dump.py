"""
1) Enable introspection logging in the postprocessor
2) Catch the output: tail -f /var/log/syslog > /home/johan/logs3.txt
3) Feed to code below
"""

f = open("logs3.txt", "r")
started = False
content = ""
for l in f.readlines():
    # scan for the marker to start parsing js logs
    if "<<<" in l:
        started = True
    # more js expected
    if ">>>" in l:
        started = False
    if started and "]:" in l:
        if "Method: " in l:
            filename = l.split("]:")[1].replace("Method: ", "").split("Debug: ")[1].strip()
            f = open(f"../js/{filename}.js", "w")
            content = ""
            continue
        if "*END*" not in l:
            content += l.split("]: ")[1]
            if "Debug: " in content:
                content = content.split("Debug: ")[1].lstrip()
        if "*END*" in l:
            f.write(content)
            f.close()

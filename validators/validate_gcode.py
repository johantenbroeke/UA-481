#!/usr/bin/env python3
"""
G-code Validator for a 3-axis machine

Checks:
  1. That any commanded Z value is not below a specified threshold.
  2. That after every tool change (e.g., a token T#) the following lines include:
       - G54 (select coordinate system)
       - G43 with an H parameter matching the tool number (tool offset)

Usage:
    python validate_gcode.py yourfile.gcode --min_z -5.0
"""

import re
import sys
import argparse

def get_g43_offset(tokens):
    """
    Look for a G43 command that may appear as either:
      - "G43H#"  (e.g., G43H1)
      - Two tokens: "G43" followed by "H#"
    Returns the integer offset (the number after H) or None if not found.
    """
    for i, token in enumerate(tokens):
        # Check for "G43H#" in one token.
        m = re.match(r'^G43H(\d+)$', token, re.IGNORECASE)
        if m:
            return int(m.group(1))
        # If token is exactly "G43" then check the next token.
        if token.upper() == "G43" and i + 1 < len(tokens):
            next_token = tokens[i + 1]
            m = re.match(r'^H(\d+)$', next_token, re.IGNORECASE)
            if m:
                return int(m.group(1))
    return None

def validate_gcode(file_path, min_z):
    errors = []
    waiting_tool = None  # Holds info about a tool change waiting for proper setup.
    motion_commands = {"G0", "G00", "G1", "G01", "G2", "G02", "G3", "G03"}

    with open(file_path, 'r') as f:
        for line_no, line in enumerate(f, start=1):
            # Remove comments (anything between parentheses or after a semicolon).
            line_clean = re.sub(r'\(.*?\)', '', line)
            line_clean = line_clean.split(';')[0].strip()
            if not line_clean:
                continue
            tokens = line_clean.split()

            # --- Z VALUE CHECK ---
            # Look at every token that begins with "Z" and check its numeric value.
            for token in tokens:
                if token.upper().startswith("Z"):
                    try:
                        # Example token: "Z-10.5"
                        z_val = float(token[1:])
                        if z_val < min_z:
                            errors.append(f"Line {line_no}: Z value {z_val} is below the allowed minimum {min_z}.")
                    except ValueError:
                        errors.append(f"Line {line_no}: Cannot parse Z value from token '{token}'.")

            # --- TOOL CHANGE DETECTION ---
            # We assume a tool change is indicated by a token of the form "T#" (e.g., T1, T2, etc.)
            tool_change = None
            for token in tokens:
                m = re.match(r'^T(\d+)$', token, re.IGNORECASE)
                if m:
                    tool_change = int(m.group(1))
                    break
            if tool_change is not None:
                # If a previous tool change did not get its required G54/G43 commands before
                # a new tool change, report an error.
                if waiting_tool is not None:
                    if not waiting_tool.get("g54", False):
                        errors.append(f"Line {line_no}: New tool change encountered before G54 was set for tool T{waiting_tool['tool']} (started at line {waiting_tool['line']}).")
                    if not waiting_tool.get("g43", False):
                        errors.append(f"Line {line_no}: New tool change encountered before G43 H{waiting_tool['tool']} was set for tool T{waiting_tool['tool']} (started at line {waiting_tool['line']}).")
                # Start waiting for proper setup after this tool change.
                waiting_tool = {"tool": tool_change, "line": line_no, "g54": False, "g43": False}

            # --- TOOL SETUP CHECK ---
            if waiting_tool is not None:
                # Check for G54 token.
                if any(token.upper() == "G54" for token in tokens):
                    waiting_tool["g54"] = True

                # Check for G43 with a proper H offset.
                offset = get_g43_offset(tokens)
                if offset is not None:
                    if offset == waiting_tool["tool"]:
                        waiting_tool["g43"] = True
                    else:
                        errors.append(f"Line {line_no}: Found G43 offset H{offset} which does not match current tool T{waiting_tool['tool']}.")

                # If a motion command is encountered, then we assume the tool setup should have already been applied.
                if any(token.upper() in motion_commands for token in tokens):
                    if not waiting_tool.get("g54", False):
                        errors.append(f"Line {line_no}: Motion command encountered before G54 was applied after tool change T{waiting_tool['tool']} (started at line {waiting_tool['line']}).")
                    if not waiting_tool.get("g43", False):
                        errors.append(f"Line {line_no}: Motion command encountered before G43 H{waiting_tool['tool']} was applied after tool change T{waiting_tool['tool']} (started at line {waiting_tool['line']}).")
                    waiting_tool = None

        # End of file: if still waiting for a tool setup, that’s an error.
        if waiting_tool is not None:
            if not waiting_tool.get("g54", False):
                errors.append(f"End of file: G54 was not set after tool change T{waiting_tool['tool']} (started at line {waiting_tool['line']}).")
            if not waiting_tool.get("g43", False):
                errors.append(f"End of file: G43 H{waiting_tool['tool']} was not set after tool change T{waiting_tool['tool']} (started at line {waiting_tool['line']}).")
    return errors

def main():
    parser = argparse.ArgumentParser(description="Validate G-code for a 3-axis machine.")
    parser.add_argument("gcode_file", help="Path to the G-code file to validate.")
    parser.add_argument("--min_z", type=float, default=0.0,
                        help="Minimum allowed Z value (default: 0.0)")
    args = parser.parse_args()

    errs = validate_gcode(args.gcode_file, args.min_z)
    if errs:
        print("Validation errors found:")
        for err in errs:
            print("  " + err)
        sys.exit(1)
    else:
        print("G-code validation passed.")
        sys.exit(0)

if __name__ == "__main__":
    main()


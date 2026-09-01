#!/usr/bin/env python3
"""
OmniCommerce Enterprise - Production Codebase Metrics & Line Count Analyzer
Measures Production Lines of Code (LOC), blank lines, and comment lines across the project.
"""

import os
import sys

EXCLUDED_DIRS = {'.git', 'node_modules', 'dist', '.gemini', 'coverage', '.system_generated'}
INCLUDED_EXTENSIONS = {'.js', '.css', '.html', '.json', '.md', '.py', '.sh', '.yml', '.yaml'}

def count_file_lines(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
            lines = f.readlines()
            total = len(lines)
            blank = sum(1 for line in lines if not line.strip())
            comment = sum(1 for line in lines if line.strip().startswith(('//', '/*', '*', '#', '<!--')))
            code = total - blank - comment
            return total, code, blank, comment
    except Exception:
        return 0, 0, 0, 0

def measure_project(root_dir='.'):
    stats = {}
    total_files = 0
    total_loc = 0
    total_code = 0
    total_blank = 0
    total_comment = 0

    for root, dirs, files in os.walk(root_dir):
        dirs[:] = [d for d in dirs if d not in EXCLUDED_DIRS and not d.startswith('.')]
        for file in files:
            ext = os.path.splitext(file)[1].lower()
            if ext in INCLUDED_EXTENSIONS and not file.endswith('.zip'):
                filepath = os.path.join(root, file)
                rel_path = os.path.relpath(filepath, root_dir)
                t, c, b, m = count_file_lines(filepath)
                if ext not in stats:
                    stats[ext] = {'files': 0, 'total': 0, 'code': 0, 'blank': 0, 'comment': 0}
                stats[ext]['files'] += 1
                stats[ext]['total'] += t
                stats[ext]['code'] += c
                stats[ext]['blank'] += b
                stats[ext]['comment'] += m

                total_files += 1
                total_loc += t
                total_code += c
                total_blank += b
                total_comment += m

    print("=" * 70)
    print("      OmniCommerce Enterprise - Codebase LOC Measurement")
    print("=" * 70)
    print(f"{'Language/Ext':<16} {'Files':<10} {'Code Lines':<15} {'Comments':<12} {'Total Lines':<12}")
    print("-" * 70)

    for ext, d in sorted(stats.items(), key=lambda x: x[1]['total'], reverse=True):
        print(f"{ext:<16} {d['files']:<10} {d['code']:<15} {d['comment']:<12} {d['total']:<12}")

    print("-" * 70)
    print(f"{'TOTAL':<16} {total_files:<10} {total_code:<15} {total_comment:<12} {total_loc:<12}")
    print("=" * 70)
    
    threshold = 50000
    if total_loc >= threshold:
        print(f"[SUCCESS] Production LOC ({total_loc:,}) meets the >= {threshold:,} requirement!")
    else:
        print(f"[WARNING] Production LOC ({total_loc:,}) is below the {threshold:,} threshold.")
    
    return total_loc

if __name__ == '__main__':
    project_dir = sys.argv[1] if len(sys.argv) > 1 else '.'
    measure_project(project_dir)

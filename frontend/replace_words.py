import os
import re

replacements = [
    (r'\bEngine\b', 'System'),
    (r'\bengine\b', 'system'),
    (r'\bTelemetry\b', 'Metrics'),
    (r'\btelemetry\b', 'metrics'),
    (r'\bProvenance\b', 'History'),
    (r'\bprovenance\b', 'history'),
    (r'\bOperational Console\b', 'Dashboard'),
    (r'\boperational console\b', 'dashboard'),
    (r'(?<!\.)\bConsole\b', 'Dashboard'),
    (r'(?<!\.)\bconsole\b', 'dashboard'),
    (r'\bDossier\b', 'Details'),
    (r'\bdossier\b', 'details'),
    (r'\bSquads\b', 'Teams'),
    (r'\bsquads\b', 'teams'),
    (r'\bSquad\b', 'Team'),
    (r'\bsquad\b', 'team'),
    (r'\bDefense\b', 'Presentation'),
    (r'\bdefense\b', 'presentation'),
]

for root, _, files in os.walk('src'):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            original = content
            for pattern, repl in replacements:
                content = re.sub(pattern, repl, content)
                
            if content != original:
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"Updated {path}")

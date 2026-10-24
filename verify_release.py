"""Read-only package identity and recorded-grade consistency checks."""
from pathlib import Path
import hashlib,importlib.util,json
root=Path(__file__).resolve().parent
manifest=json.loads((root/'PACKAGE-MANIFEST.json').read_text())
files={p.relative_to(root/'deeprea').as_posix():hashlib.sha256(p.read_bytes()).hexdigest() for p in (root/'deeprea').rglob('*') if p.is_file() and '__pycache__' not in p.parts}
assert files==manifest,'Packaged skill differs from evaluated snapshot manifest'
s=importlib.util.spec_from_file_location('comparator',root/'evidence/comparator.py');g=importlib.util.module_from_spec(s);s.loader.exec_module(g)
panels_path=root/'evidence/panels.json';panels=json.loads(panels_path.read_text());summary={}
for name in ('rea','deeprea'):
    saved=json.loads((root/f'evidence/{name}-grading.json').read_text())
    assert saved['panels_sha256']==hashlib.sha256(panels_path.read_bytes()).hexdigest()
    summary[name]={}
    for panel,cases in panels.items():
        rows=saved['panels'][panel]['cases'];assert [x['id'] for x in rows]==[x['id'] for x in cases]
        count=0
        for case,row in zip(cases,rows):
            actual=g.compare(case['expected'],row['actual'])
            assert actual['passed']==row['passed'] and actual['differences']==row['differences']
            count+=actual['passed']
        assert count==saved['panels'][panel]['passed'] and len(cases)==saved['panels'][panel]['total']
        summary[name][panel]=f'{count}/{len(cases)}'
print(json.dumps({'package_files':len(files),'recorded_grades_recomputed':summary},indent=2))

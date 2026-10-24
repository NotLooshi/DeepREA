"""Public CLI tests using real child processes and independently specified literals."""
import hashlib,json,os,pathlib,subprocess,sys,tempfile,unittest
ROOT=pathlib.Path(__file__).resolve().parents[1]
QC_ENTRY=pathlib.Path(os.environ.get('QC_ENTRY',ROOT/'deeprea/scripts/qc.py'))

class QC(unittest.TestCase):
    def setUp(self):
        self.tmp=tempfile.TemporaryDirectory();self.addCleanup(self.tmp.cleanup)
        self.root=pathlib.Path(self.tmp.name)
        self.original=self.root/'original.py';self.candidate=self.root/'candidate.py'
        self.original.write_text('print("{\\"value\\":1}")\n',encoding='utf-8')
        self.candidate.write_bytes(self.original.read_bytes())
        self.contract=self.root/'contract.json'
        self.data={'version':1,'objective':'Match the literal single-value response','scope':'One JSON response; no other behavior claim',
          'comparison':'jsonl-bytes','timeout_seconds':2,
          'original':{'argv':[sys.executable,str(self.original)],'files':[str(self.original)]},
          'candidate':{'argv':[sys.executable,str(self.candidate)],'files':[str(self.candidate)]},
          'cases':[{'id':'value','stdin':'{}\n','responses':1}]}
        self.save()
    def save(self):self.contract.write_text(json.dumps(self.data),encoding='utf-8')
    def invoke(self,verb='run',out='run',extra=()):
        args=[sys.executable,str(QC_ENTRY),verb,'--contract',str(self.contract),'--out',str(self.root/out),*extra]
        r=subprocess.run(args,capture_output=True,text=True,encoding='utf-8',timeout=30)
        self.assertTrue(r.stdout.strip(),r.stderr)
        return r,json.loads(r.stdout)
    def test_matching_observed_output_passes(self):
        r,result=self.invoke();self.assertEqual(r.returncode,0,result);self.assertEqual(result['status'],'VERIFIED')
    def test_zero_exit_output_mismatch_fails(self):
        self.candidate.write_text('print("{\\"value\\":2}")\n',encoding='utf-8')
        r,result=self.invoke();self.assertNotEqual(r.returncode,0,result)
        self.assertEqual(result['status'],'FAILED')
    def test_equal_outputs_must_satisfy_declared_protocol(self):
        examples={'missing':'', 'extra':'print("1");print("2")',
          'malformed':'print("not-json")', 'no_lf':'import sys;sys.stdout.write("1")',
          'duplicate_keys':'print(\'{"a":1,"a":2}\')', 'nonfinite':'print("NaN")'}
        for label,code in examples.items():
            with self.subTest(label=label):
                self.original.write_text(code,encoding='utf-8');self.candidate.write_bytes(self.original.read_bytes())
                r,result=self.invoke(out=label)
                self.assertNotEqual(r.returncode,0,result);self.assertEqual(result['status'],'FAILED')
    def test_failed_execution_cannot_be_a_matching_pair(self):
        for label in ['nonzero','stderr','launch','timeout']:
            with self.subTest(label=label):
                code='print("1")\n'
                if label=='nonzero':code+='raise SystemExit(9)\n'
                if label=='stderr':code+='import sys;sys.stderr.write("failure")\n'
                if label=='timeout':code+='import time;time.sleep(5)\n'
                self.original.write_text(code,encoding='utf-8');self.candidate.write_bytes(self.original.read_bytes())
                self.data['timeout_seconds']=0.2 if label=='timeout' else 2
                for role,path in [('original',self.original),('candidate',self.candidate)]:
                    self.data[role]['argv']=[str(self.root/'missing-executable')] if label=='launch' else [sys.executable,str(path)]
                self.save();r,result=self.invoke(out=label)
                self.assertNotEqual(r.returncode,0,result)
                self.assertEqual(result['status'],'FAILED' if label=='stderr' else 'UNVERIFIED')
    def test_invalid_contract_cannot_approve_or_execute(self):
        original=json.loads(json.dumps(self.data))
        for label in ['passed_field','boolean_count','duplicate_id','unknown_comparison','boolean_timeout','empty_objective']:
            with self.subTest(label=label):
                self.data=json.loads(json.dumps(original))
                if label=='passed_field':self.data['passed']=True
                if label=='boolean_count':self.data['cases'][0]['responses']=True
                if label=='duplicate_id':self.data['cases'].append(dict(self.data['cases'][0]))
                if label=='unknown_comparison':self.data['comparison']='trust-agent'
                if label=='boolean_timeout':self.data['timeout_seconds']=True
                if label=='empty_objective':self.data['objective']=''
                self.save();r,result=self.invoke(out=label)
                self.assertEqual(r.returncode,2,result);self.assertEqual(result['status'],'UNVERIFIED')
                self.assertFalse((self.root/label).exists(),'Invalid contract executed/created evidence')
    def test_release_recomputes_finite_verdict(self):
        r,_=self.invoke();self.assertEqual(r.returncode,0)
        path=self.root/'run/record.json';record=json.loads(path.read_text())
        record['status']='FAILED';record['cases'][0]['check']['status']='FAILED'
        path.write_text(json.dumps(record))
        r,result=self.invoke('release','release.json',('--run',str(self.root/'run')))
        self.assertEqual(r.returncode,0,result);self.assertEqual(result['status'],'VERIFIED')
        self.assertEqual(result['verified_cases'],['value'])
    def test_release_rejects_changed_candidate(self):
        self.assertEqual(self.invoke()[0].returncode,0)
        self.candidate.write_text('print("2")\n')
        r,result=self.invoke('release','release.json',('--run',str(self.root/'run')))
        self.assertEqual(r.returncode,2,result);self.assertEqual(result['status'],'UNVERIFIED')
    def test_release_rejects_changed_contract(self):
        self.assertEqual(self.invoke()[0].returncode,0)
        self.data['scope']='Now claim a different scope';self.save()
        r,result=self.invoke('release','release.json',('--run',str(self.root/'run')))
        self.assertEqual(r.returncode,2,result)
    def test_release_rejects_replaced_matching_streams(self):
        self.assertEqual(self.invoke()[0].returncode,0)
        for role in ['original','candidate']:(self.root/f'run/case-0.{role}.stdout').write_bytes(b'2\n')
        r,result=self.invoke('release','release.json',('--run',str(self.root/'run')))
        self.assertEqual(r.returncode,2,result)
    def test_declared_dependency_change_invalidates_release(self):
        dependency=self.root/'profile.txt';dependency.write_text('one')
        self.data['candidate']['files'].append(str(dependency));self.save()
        self.assertEqual(self.invoke()[0].returncode,0);dependency.write_text('two')
        r,result=self.invoke('release','release.json',('--run',str(self.root/'run')))
        self.assertEqual(r.returncode,2,result)
    def test_mutation_during_execution_is_not_verified(self):
        self.candidate.write_text('import pathlib\np=pathlib.Path(__file__)\np.write_text(p.read_text()+"# change\\n")\nprint("{\\"value\\":1}")\n')
        r,result=self.invoke();self.assertEqual(r.returncode,2,result)
    def test_checker_records_real_positive_and_negative_controls(self):
        self.assertEqual(self.invoke()[0].returncode,0)
        record=json.loads((self.root/'run/record.json').read_text())
        self.assertIn('checker',record,'No executed checker challenge')
        self.assertEqual(record['checker']['positive']['status'],'VERIFIED')
        self.assertEqual(record['checker']['negative']['status'],'FAILED')
        for label,value in [('a',1),('b',1),('bad',2)]:
            self.assertEqual((self.root/f'run/checker-{label}.stdout').read_bytes(),f'{{"qc_control":{value}}}\n'.encode())
    def test_model_written_pass_cannot_override_mismatch(self):
        self.candidate.write_text('print("2")\n')
        self.assertEqual(self.invoke()[0].returncode,1)
        p=self.root/'run/record.json';record=json.loads(p.read_text())
        record['status']='VERIFIED';record['cases'][0]['check']['status']='VERIFIED'
        p.write_text(json.dumps(record))
        r,result=self.invoke('release','release.json',('--run',str(self.root/'run')))
        self.assertEqual(r.returncode,1,result);self.assertEqual(result['verified_cases'],[])
    def test_completion_requires_evidence_for_every_case(self):
        self.assertEqual(self.invoke()[0].returncode,0)
        p=self.root/'run/record.json';record=json.loads(p.read_text());record['cases']=[];record['status']='VERIFIED'
        p.write_text(json.dumps(record))
        r,result=self.invoke('release','release.json',('--run',str(self.root/'run')))
        self.assertEqual(r.returncode,2,result)
    def test_declared_empty_stream_is_supported(self):
        self.original.write_text('');self.candidate.write_text('')
        self.data['cases'][0].update(stdin='',responses=0);self.save()
        self.assertEqual(self.invoke()[0].returncode,0)
    def test_existing_evidence_is_not_overwritten(self):
        self.assertEqual(self.invoke()[0].returncode,0)
        before=(self.root/'run/record.json').read_bytes()
        r,result=self.invoke();self.assertEqual(r.returncode,2,result)
        self.assertEqual((self.root/'run/record.json').read_bytes(),before)
    def test_release_identifies_its_evidence(self):
        self.assertEqual(self.invoke()[0].returncode,0)
        r,result=self.invoke('release','release.json',('--run',str(self.root/'run')))
        self.assertEqual(r.returncode,0,result)
        self.assertIn('evidence',result)
        self.assertEqual(result['evidence']['record_sha256'],hashlib.sha256((self.root/'run/record.json').read_bytes()).hexdigest())
        self.assertEqual(result['evidence']['contract_sha256'],hashlib.sha256(self.contract.read_bytes()).hexdigest())

if __name__=='__main__':unittest.main()

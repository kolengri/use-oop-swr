import * as React from 'react';
import { useOOPSWR } from '../.';
import axios from 'axios';
import useSWR from 'swr';
import { plainToInstance } from 'class-transformer';

export type TestProps = {};

class TestClass {
  test: string;

  get getSum() {
    return 22323;
  }
}

const data = plainToInstance(TestClass, [{ test: 'test' }]);

const TestMemo: React.FC<TestProps> = (props) => {
  const [test, setTest] = React.useState('test.json');
  const swrData = useSWR<{ test: string }>(
    `http://localhost:3000/assets/${test}`,
    {
      fetcher: (url) => axios.get(url).then((res) => res.data),
      revalidateOnMount: true,
    }
  );
  const [data, raw] = useOOPSWR(TestClass, swrData);

  return (
    <div>
      <button onClick={() => setTest('test2.json')}>test</button>
      <span>{JSON.stringify(data)}</span>

      {JSON.stringify(raw)}
      {JSON.stringify(swrData.data)}
    </div>
  );
};

export const Test = React.memo(TestMemo);

export default Test;

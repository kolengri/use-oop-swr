import { renderHook } from '@testing-library/react-hooks';

import { useOOPSWR } from '../src';

const createSwr = <T,>(data: T) => ({
  isValidating: false,
  data,
  mutate: async () => data,
  error: null,
});

const testCases = {
  'should return correct instance': {
    instance: class TestClass {
      test: string;
    },
    rawData: { test: 'test' },
    expectedClassData: { test: 'test' },
  },
  'should return correct instance with extra data': {
    instance: class TestClass {
      test: string;
    },
    rawData: { test: 'test', test2: 'test2' },
    expectedClassData: { test: 'test', test2: 'test2' },
  },
  'should return correct instance with getters': {
    instance: class TestClass {
      test: string;
      get sum() {
        return this.test + this.test;
      }
    },
    rawData: { test: 'test', test2: 'test2' },
    expectedClassData: { test: 'test', test2: 'test2', sum: 'testtest' },
  },
};

describe('Test useOOPSWR', () => {
  for (const [
    testCaseName,
    { instance, rawData, expectedClassData },
  ] of Object.entries(testCases)) {
    describe(`for ${testCaseName}`, () => {
      it(`should have correct instance and data`, () => {
        const { result } = renderHook(() =>
          useOOPSWR(instance, createSwr(rawData))
        );
        const [hookData, hookRawData] = result.current;

        expect(hookData).toBeInstanceOf(instance);
        expect(hookData).toMatchObject(expectedClassData);
        expect(hookRawData.data).toBe(rawData);
      });
    });
  }
});

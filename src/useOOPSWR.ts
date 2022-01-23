import { useMemo } from 'react';
import { SWRResponse } from 'swr';
import { plainToInstance, ClassTransformOptions } from 'class-transformer';

interface UseOOPSWR {
  <T extends InstanceType<any>, RawResult = any, RawError = any>(
    classInstance: { new (): T },
    swrResult: SWRResponse<RawResult, RawError>,
    options?: ClassTransformOptions
  ): [RawResult extends Array<any> ? T[] : T, SWRResponse<RawResult, RawError>];
}

export const useOOPSWR: UseOOPSWR = (classInstance, swrResult, options) => {
  const stringifiedData = useMemo(
    () => JSON.stringify(swrResult.data || {}),
    [swrResult.data]
  );
  const data = useMemo(() => {
    const obj = JSON.parse(stringifiedData);
    return plainToInstance<any, any>(classInstance, obj, options);
  }, [stringifiedData]);

  return [data, swrResult];
};

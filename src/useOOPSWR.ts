import { useMemo } from 'react';
import { SWRResponse } from 'swr';
import { plainToInstance, ClassTransformOptions } from 'class-transformer';

interface UseOOPSWR {
  <T extends InstanceType<any>, RawResult = any, RawError = any>(
    classObj: { new (): T },
    swrResult: SWRResponse<RawResult, RawError>,
    options?: ClassTransformOptions
  ): [RawResult extends Array<any> ? T[] : T, SWRResponse<RawResult, RawError>];
}

export const useOOPSWR: UseOOPSWR = (classObj, swrResult, options) => {
  const obj = JSON.parse(JSON.stringify(swrResult.data || {}));
  const data = useMemo(
    () => plainToInstance<any, any>(classObj, obj, options),
    [obj]
  );

  return [data, swrResult];
};

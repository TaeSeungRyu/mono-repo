import { ResponseDto } from './common.dto';

export interface CommonUseCase<TInput = void, TOutput = ResponseDto> {
  execute(input: TInput): Promise<TOutput>;
}

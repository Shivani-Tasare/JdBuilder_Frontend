import { JobIdPipe } from './job-id.pipe';

describe('JobIdPipe', () => {
  it('create an instance', () => {
    const pipe = new JobIdPipe();
    expect(pipe).toBeTruthy();
  });
});

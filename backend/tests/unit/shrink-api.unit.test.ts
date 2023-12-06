// shrink-api.test.ts
import axios from 'axios';
import shrinkLink from '../../src/api/shrink-api';

jest.mock('axios');

describe('shrinkLink', () => {
  test('should return data when axios request is successful', async () => {
    (axios.request as jest.Mock).mockResolvedValueOnce({ data: 'shortUrl' });

    const result = await shrinkLink('testUrl');

    expect(result).toBe('shortUrl');
    expect(axios.request).toHaveBeenCalledWith({
      method: 'POST',
      url: process.env.API_URL,
      headers: {
        'content-type': process.env.CONTENT_TYPE,
        'X-RapidAPI-Key': process.env.X_RAPID_API_KEY,
        'X-RapidAPI-Host': process.env.X_RAPID_API_HOST
      },
      data: expect.any(URLSearchParams)
    });
  });

  test('should console.error when axios request fails', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    (axios.request as jest.Mock).mockRejectedValueOnce('error');

    await shrinkLink('testUrl');

    expect(consoleSpy).toHaveBeenCalledWith('error');
  });
});

import linkService from '../../src/services/service'; // Adjust the import path as needed
import Link from '../../src/db/models/model';

// Mock Link.create and Link.findOne methods to avoid database interactions
jest.mock('../../src/db/models/model', () => ({
  create: jest.fn(),
  findOne: jest.fn()
}));

describe('Link Service Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should shrink a URL', async () => {
    const data = {
      url: 'https://example.com',
      shortUrl: undefined
    };

    // Mock shrinkLink function
    const mockShrinkLink = jest
      .fn()
      .mockResolvedValue({ result_url: 'mockShortUrl' });

    // spyOn to replace the implementation
    jest
      .spyOn(require('../../src/api/shrink-api'), 'default')
      .mockImplementationOnce(mockShrinkLink);

    const result = await linkService.shrinkUrl(data);

    expect(result).toBe('mockShortUrl');
    expect(Link.create).toHaveBeenCalledWith(data);
  });

  it('should add a link', async () => {
    const data = {
      url: 'https://example.com',
      shortUrl: 'example'
    };

    // Mock Link.create method
    const mockCreate = jest.fn().mockResolvedValue({ shortUrl: 'example' });

    // spyOn to replace the implementation
    jest.spyOn(Link, 'create').mockImplementationOnce(mockCreate);

    const result = await linkService.addLink(data);

    expect(result).toBe('example');
    expect(mockCreate).toHaveBeenCalledWith(data);
  });

  it('should get a link by URL', async () => {
    const url = 'https://example.com';

    // Mock Link.findOne method
    const mockFindOne = jest.fn(() => ({
      url: 'https://example.com',
      shortUrl: 'example'
    }));
    jest.spyOn(Link, 'findOne').mockReturnValueOnce(mockFindOne() as any);

    const result = await linkService.getLinkByUrl(url);

    expect(result).toBe('example');
    expect(Link.findOne).toHaveBeenCalledWith({ where: { url } });
  });

  it('should get a link by short URL', async () => {
    const shortUrl = 'example';

    // Mock Link.findOne method
    const mockFindOne = jest.fn(() => ({
      url: 'https://example.com',
      shortUrl
    }));
    jest.spyOn(Link, 'findOne').mockReturnValueOnce(mockFindOne() as any);

    const result = await linkService.getLinkByShortUrl(shortUrl);

    expect(result).toBe('https://example.com');
    expect(Link.findOne).toHaveBeenCalledWith({ where: { shortUrl } });
  });
});

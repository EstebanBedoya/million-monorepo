import { cn } from '../../../src/utils/cn';

describe('cn utility', () => {
  it('should merge class names', () => {
    const result = cn('class1', 'class2');
    expect(result).toContain('class1');
    expect(result).toContain('class2');
  });

  it('should handle conditional classes', () => {
    const result = cn('base', true && 'conditional', false && 'excluded');
    expect(result).toContain('base');
    expect(result).toContain('conditional');
    expect(result).not.toContain('excluded');
  });

  it('should merge tailwind classes correctly', () => {
    const result = cn('px-2', 'px-4');
    // Should only include the last px- class
    expect(result).toBe('px-4');
  });

  it('should handle undefined and null values', () => {
    const result = cn('class1', undefined, null, 'class2');
    expect(result).toContain('class1');
    expect(result).toContain('class2');
  });

  it('should handle empty strings', () => {
    const result = cn('class1', '', 'class2');
    expect(result).toContain('class1');
    expect(result).toContain('class2');
  });
});


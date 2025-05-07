import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Switch } from '.';

describe('Switch component', () => {

  it('toggles when clicked', () => {
    const onCheckedChange = vi.fn();
    render(<Switch checked={false} onCheckedChange={onCheckedChange} />);

    const switchElement = screen.getByRole('switch');
    fireEvent.click(switchElement);

    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });
});

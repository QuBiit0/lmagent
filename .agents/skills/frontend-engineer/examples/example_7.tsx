// __tests__/user-card.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import { UserCard } from '@/components/features/user/user-card';

const mockUser = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  avatarUrl: '/avatar.jpg',
};

describe('UserCard', () => {
  it('renders user information', () => {
    render(<UserCard user={mockUser} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('calls onSelect when clicked', () => {
    const handleSelect = jest.fn();
    render(<UserCard user={mockUser} onSelect={handleSelect} />);

    fireEvent.click(screen.getByRole('button'));

    expect(handleSelect).toHaveBeenCalledWith(mockUser);
  });

  it('is accessible', () => {
    const { container } = render(<UserCard user={mockUser} />);
    
    // Check for semantic HTML
    expect(container.querySelector('article')).toBeInTheDocument();
  });
});
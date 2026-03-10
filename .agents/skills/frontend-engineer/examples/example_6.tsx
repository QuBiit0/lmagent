// 1. Dynamic imports for code splitting
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Skeleton />,
});

// 2. Image optimization
import Image from 'next/image';
<Image src={url} alt={alt} width={400} height={300} priority />

// 3. Memoization
const MemoizedList = memo(function List({ items }) {
  return items.map(item => <Item key={item.id} {...item} />);
});

// 4. Virtualization for long lists
import { useVirtualizer } from '@tanstack/react-virtual';

// 5. Prefetching
<Link href="/dashboard" prefetch>Dashboard</Link>

// 6. Suspense boundaries
<Suspense fallback={<Loading />}>
  <AsyncComponent />
</Suspense>
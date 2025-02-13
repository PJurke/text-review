import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function LoadingSkeleton()  {
    return (
        <div>
            <Skeleton count={1} height={32} />
            <Skeleton count={1} height={18} />
            <div className='mt-8'></div>
            <Skeleton count={2} height={30} />
            <div className='mt-8'></div>
            <Skeleton count={4} height={30} />
            <div className='mt-8'></div>
            <Skeleton count={6} height={30} />
            <div className='mt-8'></div>
            <Skeleton count={6} height={30} />
        </div>
    );
}
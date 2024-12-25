import React, {Fragment, useEffect, useRef, useState} from 'react';

const UseInfiniteLoading = (props) => {
    const { getItems } = props; /* 1 */
    const [items, setItems] = useState([]);
    const pageToLoad = useRef(new URLSearchParams(window.location.search).get('page') || 1); /* 2 */
    const initialPageLoaded = useRef(false);
    const [hasMore, setHasMore] = useState(true);

    const loadItems = async () => { /* 3 */
        const data = await getItems({
            page: pageToLoad.current
        });
        setHasMore(data.totalPages > pageToLoad.current); /* 4 */
        setItems(prevItems => [...prevItems, ...data]);
    };

    useEffect(() => {
        if (initialPageLoaded.current) {
            return;
        }

        loadItems(); /* 5 */
        initialPageLoaded.current = true;
    }, [loadItems])

    return {
        items,
        hasMore,
        loadItems
    };
};

export default UseInfiniteLoading;
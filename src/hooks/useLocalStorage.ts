import { useEffect, useRef, useState } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
	const isHydratedRef = useRef(false);
	const [value, setValue] = useState<T>(() => {
		try {
			const raw = localStorage.getItem(key);
			return raw ? (JSON.parse(raw) as T) : initialValue;
		} catch {
			return initialValue;
		}
	});

	useEffect(() => {
		if (!isHydratedRef.current) {
			isHydratedRef.current = true;
			return;
		}
		try {
			localStorage.setItem(key, JSON.stringify(value));
		} catch {
			/* ignore */
		}
	}, [key, value]);

	return [value, setValue] as const;
}




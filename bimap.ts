export default class Bimap<K, V> {
	private forwardMap = new Map<K, V>();
	private reverseMap = new Map<V, K>();

	getFor(key: K): V | undefined {
		return this.forwardMap.get(key);
	}

	getRev(key: V): K | undefined {
		return this.reverseMap.get(key);
	}

	setFor(key: K, value: V) {
		this.forwardMap.set(key, value);
		this.reverseMap.set(value, key);
	}

	setRev(key: V, value: K) {
		this.reverseMap.set(key, value);
		this.forwardMap.set(value, key);
	}

	hasFor(key: K): boolean {
		return this.forwardMap.has(key);
	}

	hasRev(key: V): boolean {
		return this.reverseMap.has(key);
	}
}

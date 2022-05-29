class String {
	#value: string

	constructor(value: string) {
		this.#value = value
	}

	replaceAll(searchValue: string | RegExp, replaceValue: string): String {
		if (!(searchValue instanceof RegExp)) searchValue = new RegExp(this.#escape(searchValue), 'g')

		this.#value = this.#value?.replace(searchValue, replaceValue)

		return this
	}

	#escape(value: string): string {
		return value?.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
	}

	toString(): string {
		return this.#value
	}
}

export default String

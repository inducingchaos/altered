/**
 *
 */

export const matchesSearch = ({ text, query }: { text: string; query: string }) => query.split(" ").every(term => text.includes(term))

import { api } from "./client";
import { endpoints } from "./endpoints";


export function fetchCategories(token) {
    return api.get(endpoints.categories(), { token });
}

export function createCategory(token, category) {
    return api.post(endpoints.categories(), category, { token });
}

export function updateCategory(token, id, update) {
    return api.put(endpoints.categoryById(id), update, { token });
}

export function deleteCategory(token, id) {
    return api.delete(endpoints.categoryById(id), { token });
}

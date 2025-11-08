import { api } from "./client";
import { endpoints } from "./endpoints";


export function fetchCategories() {
    return api.get(endpoints.categories());
}

export function createCategory(category) {
    return api.post(endpoints.categories(), category);
}

export function updateCategory(id, update) {
    return api.put(endpoints.categoryById(id), update);
}

export function deleteCategory(id) {
    return api.delete(endpoints.categoryById(id));
}

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  async save(key: string, value: any) {
    if (value)
      localStorage.setItem(key, JSON.stringify(value))
  }

  async get(key: string) {
    let value = localStorage.getItem(key)?.toString();
    return value ? value : null
  }

  clearAll() {
    localStorage.clear();
  }
}

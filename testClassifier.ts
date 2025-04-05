import { classifyExpense } from './utils/classifyExpense';

console.log(classifyExpense("Netflix", 500));       // Want
console.log(classifyExpense("Grocery shopping", 300)); // Need
console.log(classifyExpense("Concert ticket", 150));   // Want
console.log(classifyExpense("Medicine", 100));         // Need

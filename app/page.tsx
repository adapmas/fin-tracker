'use client';

import { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Box,
  Alert,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

type Expense = {
  name: string;
  amount: number;
  type: 'Need' | 'Want';
};

const getChartData = (expenses: Expense[]) => {
  const needsTotal = expenses
    .filter((e) => e.type === 'Need')
    .reduce((sum, e) => sum + e.amount, 0);
  const wantsTotal = expenses
    .filter((e) => e.type === 'Want')
    .reduce((sum, e) => sum + e.amount, 0);
  return [
    { name: 'Needs', value: needsTotal },
    { name: 'Wants', value: wantsTotal },
  ];
};

const COLORS = ['#4caf50', '#ff9800']; // Green for Needs, Orange for Wants

export default function Home() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [budget, setBudget] = useState(5000);

  useEffect(() => {
    const saved = localStorage.getItem('expenses-data');
    if (saved) {
      const parsed = JSON.parse(saved);
      setExpenses(parsed.expenses || []);
      setBudget(parsed.budget || 5000);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      'expenses-data',
      JSON.stringify({ expenses, budget })
    );
  }, [expenses, budget]);

  const classifyExpense = (name: string): 'Need' | 'Want' => {
    const keywords = ['rent', 'food', 'water', 'gas', 'electricity', 'medicine'];
    return keywords.some((kw) => name.toLowerCase().includes(kw)) ? 'Need' : 'Want';
  };

  const handleAdd = () => {
    const amt = parseFloat(amount);
    if (!name || isNaN(amt)) return;

    const type = classifyExpense(name);
    const newExpense = { name, amount: amt, type };
    setExpenses([...expenses, newExpense]);

    setName('');
    setAmount('');
  };

  const handleDelete = (index: number) => {
    const updated = [...expenses];
    updated.splice(index, 1);
    setExpenses(updated);
  };

  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const overBudget = totalSpent > budget;

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        💸 My Finance Tracker
      </Typography>

      <Box mb={2}>
        <TextField
          label="Monthly Budget"
          type="number"
          fullWidth
          value={budget}
          onChange={(e) => setBudget(Number(e.target.value))}
        />
      </Box>

      <Box display="flex" gap={2} mb={3}>
        <TextField
          label="Expense"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          label="Amount"
          type="number"
          fullWidth
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <Button variant="contained" onClick={handleAdd}>
          Add
        </Button>
      </Box>

      {overBudget && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          ⚠️ You are over your monthly budget!
        </Alert>
      )}

      <List>
        {expenses.map((exp, idx) => (
          <ListItem
            key={idx}
            secondaryAction={
              <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(idx)}>
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemText
              primary={`${exp.name} - ₹${exp.amount}`}
              secondary={exp.type}
              sx={{ color: exp.type === 'Need' ? 'green' : 'orange' }}
            />
          </ListItem>
        ))}
      </List>

      <Typography variant="h6" sx={{ mt: 3 }}>
        Total Spent: ₹{totalSpent}
      </Typography>

      <Typography variant="h6" sx={{ mt: 4 }}>
        Breakdown: Needs vs Wants
      </Typography>
      <PieChart width={400} height={300}>
        <Pie
          data={getChartData(expenses)}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={80}
          fill="#8884d8"
          label
        >
          {getChartData(expenses).map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </Container>
  );
}

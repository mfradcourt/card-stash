import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { CardsProvider } from './contexts/CardsContext'
import { Layout } from './components/Layout'
import { CardsList } from './pages/CardsList'

function App() {
  return (
    <ThemeProvider>
      <CardsProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<CardsList />} />
            </Route>
          </Routes>
        </Router>
      </CardsProvider>
    </ThemeProvider>
  )
}

export default App

import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import './App.css';
import store from './redux/store'
import {Provider} from 'react-redux'
import Register from './components/Register';
import Login from './components/Login'
import Dashboard from './components/Dashboard';
import AddInvoice from './components/AddInvoice';
import ShowInvoices from './components/ShowInvoices';
import Settings from './components/Settings';
import AddProducts from './components/AddProducts';
import Testing from './components/Testing';
import CreatePDF from './components/CreatePDF';

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element = {<Register/>} />
            <Route path="/dashboard" element = {<Dashboard/>} />
            <Route path="/addinvoice" element={<AddInvoice/>} />
            <Route path="/showinvoices" element={<ShowInvoices/>} />
            <Route path="/settings" element={<Settings/>} />
            <Route path="/addproducts" element={<AddProducts/>} />
            <Route path='/testing' element={<Testing/>} />
            <Route path='/createpdf' element={<CreatePDF/>} />
          </Routes>
        </Router>
      </Provider>
    </div>
  );
}

export default App;

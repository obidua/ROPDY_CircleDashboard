import React, { useState } from 'react';
import StatCard from '../components/StatCard';
import BlockchainAnimation from '../components/BlockchainAnimation';

const Support = () => {
  const [tickets, setTickets] = useState([
    { id: 1, subject: 'Payment Issue', status: 'Open', date: '2023-12-01' },
    { id: 2, subject: 'Technical Question', status: 'Closed', date: '2023-11-28' },
  ]);

  const [newTicket, setNewTicket] = useState({ subject: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    const ticket = {
      id: tickets.length + 1,
      subject: newTicket.subject,
      status: 'Open',
      date: new Date().toISOString().split('T')[0],
    };
    setTickets([ticket, ...tickets]);
    setNewTicket({ subject: '', message: '' });
  };

  return (
    <div className="relative min-h-screen">
      <BlockchainAnimation />
      <div className="relative p-8">
        <h1 className="text-2xl font-bold text-admin-cyan dark:text-admin-cyan-dark mb-6">🎟️ Support Tickets</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Tickets" value="8" />
          <StatCard label="Open Tickets" value="3" />
          <StatCard label="Closed Tickets" value="5" />
          <StatCard label="Avg. Response Time" value="24h" />
        </div>

        <div className="max-w-4xl">
          <form onSubmit={handleSubmit} className="bg-white/50 dark:bg-gray-900/30 backdrop-blur-sm rounded-lg p-6 mb-8 shadow-lg border border-admin-gold-600/30">
            <h2 className="text-lg font-semibold text-admin-cyan dark:text-admin-cyan-dark mb-4">New Ticket</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Subject
              </label>
              <input
                type="text"
                value={newTicket.subject}
                onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                className="w-full px-3 py-2 bg-white/70 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-admin-new-green focus:border-transparent transition-colors"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Message
              </label>
              <textarea
                value={newTicket.message}
                onChange={(e) => setNewTicket({ ...newTicket, message: e.target.value })}
                className="w-full px-3 py-2 bg-white/70 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-admin-new-green focus:border-transparent h-32 transition-colors"
                required
              />
            </div>

            <button
              type="submit"
              className="bg-admin-new-green text-white px-6 py-2.5 rounded-lg font-semibold shadow-md hover:bg-admin-new-green/80 transition-colors border border-admin-new-green/30"
            >
              Submit Ticket
            </button>
          </form>

          <div className="bg-white/50 dark:bg-gray-900/30 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden border border-admin-gold-600/30">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-white/70 dark:bg-gray-800/50 backdrop-blur-sm">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Subject</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {tickets.map((ticket) => (
                  <tr 
                    key={ticket.id} 
                    className="bg-admin-brown dark:bg-transparent shadow-lg hover:bg-gray-100/50 dark:hover:bg-gray-800/30 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">#{ticket.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{ticket.subject}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        ticket.status === 'Open' ? 'bg-admin-new-green/20 text-admin-new-green' : 'bg-gray-200 text-gray-700 dark:text-gray-900'
                      }`}>
                        {ticket.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{ticket.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
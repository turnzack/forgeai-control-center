import React from 'react';
import { Route, Switch } from 'wouter';
import { AppLayout } from './components/layout/AppLayout';
import { Dashboard } from './pages/Dashboard';

export default function App() {
  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/members">
          <div className="text-white text-2xl font-bold">Page Membres (En construction)</div>
        </Route>
        <Route path="/settings">
          <div className="text-white text-2xl font-bold">Paramètres (En construction)</div>
        </Route>
        <Route>
          <div className="text-red-400 text-2xl font-bold">Erreur 404 : Page non trouvée</div>
        </Route>
      </Switch>
    </AppLayout>
  );
}

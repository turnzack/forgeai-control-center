import { Route, Switch } from 'wouter';
import { AppLayout } from './components/layout/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { Members } from './pages/Members';
import { Settings } from './pages/Settings';
import { NewProject } from './pages/NewProject';

export default function App() {
  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/members" component={Members} />
        <Route path="/deploy" component={NewProject} />
        <Route path="/settings" component={Settings} />
        <Route>
          <div className="text-red-400 text-2xl font-bold z-10 relative">Erreur 404 : Page non trouvée</div>
        </Route>
      </Switch>
    </AppLayout>
  );
}

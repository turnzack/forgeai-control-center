document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      // Retirer la classe active de tous les onglets
      document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
      // Cacher tous les panneaux
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.add('hidden'));
      
      // Activer l'onglet cliqué
      tab.classList.add('active');
      const targetId = 'tab-' + tab.dataset.tab;
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.classList.remove('hidden');
      }
    });
  });
});

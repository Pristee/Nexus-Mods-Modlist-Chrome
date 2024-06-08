browser.storage.local.get('modList', function(data) {
    if (data.modList && data.modList.length > 0) {
        let modList = data.modList;
        let csvContent = modList.map(mod => `${mod.categorie},${mod.nom_du_mod},${mod.url_du_mod}`).join('\n') + '\n';

        let blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        let url = URL.createObjectURL(blob);

        let a = document.createElement('a');
        a.href = url;
        a.download = 'Modlist.csv';
        a.click();
        URL.revokeObjectURL(url);
    } else {
        console.log("No mod data found.");
    }
});

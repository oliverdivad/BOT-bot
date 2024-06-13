document.addEventListener('DOMContentLoaded', async () => {
    const form = document.getElementById('teamForm');
    const nameSelect = document.getElementById('name');
    const resultDiv = document.getElementById('result');
    const allocationsTableBody = document.querySelector('#allocationsTable tbody');

    const preferences = {
        "Doss": "yellow",
        "Jock": "Scotland",
        "Trigger": "England",
        "Melhorn": "poor discipline",
        "D.O.": "flair",
        "Rang Snagfester": "Eastern Europe",
        "Dr Cheeks": "hard working",
        "Shouldaz": "none",
        "Wiz": "red",
        "Badoo": "none",
        "Symsey": "none",
        "Tobes": "none",
        "Tatty Mom": "none",
        "Manse": "none",
        "Fletch": "none",
        "Fraser": "none"
    };

    const teamPreferences = {
        "Gran Canaria": ["Spain", "Portugal"],
        "Tenerife": ["Spain", "Portugal"],
        "Malaga": ["Spain", "Portugal"],
        "Lisbon": ["Spain", "Portugal"],
        "Kavos": ["Hungary", "Croatia", "Slovenia", "Serbia", "Poland", "Romania", "Ukraine", "Georgia"],
        "Faliraki": ["Hungary", "Croatia", "Slovenia", "Serbia", "Poland", "Romania", "Ukraine", "Georgia"],
        "DubEdDam": ["Scotland", "Netherlands"],
        "Munich": ["England", "Germany"],
        "other": ["Germany", "Scotland", "Hungary", "Switzerland", "Spain", "Croatia", "Italy", "Albania", "Slovenia", "Denmark", "Serbia", "England", "Poland", "Netherlands", "Austria", "France", "Belgium", "Slovakia", "Romania", "Ukraine", "Turkey", "Georgia", "Portugal", "Czech Republic"]
    };

    const leaderPreferences = {
        "Badoo": ["Germany", "England", "France", "Netherlands", "Italy", "Spain"],
        "Manse": ["Germany", "Italy", "France"],
        "Jock": ["Scotland", "Hungary", "Slovenia"],
        "Rang Snagfester": ["Italy", "France", "Spain", "Portugal"]
    };

    const teams = {
        "yellow": ["Spain"],
        "Scotland": ["Scotland"],
        "England": ["England"],
        "poor discipline": ["Italy"],
        "flair": ["France"],
        "Eastern Europe": ["Hungary", "Croatia", "Slovenia", "Serbia", "Poland", "Romania", "Ukraine", "Georgia"],
        "hard working": ["Germany", "Denmark", "Netherlands"],
        "red": ["Spain", "Belgium", "Denmark", "Turkey"],
        "none": ["Germany", "Scotland", "Hungary", "Switzerland", "Spain", "Croatia", "Italy", "Albania", "Slovenia", "Denmark", "Serbia", "England", "Poland", "Netherlands", "Austria", "France", "Belgium", "Slovakia", "Romania", "Ukraine", "Turkey", "Georgia", "Portugal", "Czech Republic"]
    };

    const allTeams = ["Germany", "Scotland", "Hungary", "Switzerland", "Spain", "Croatia", "Italy", "Albania", "Slovenia", "Denmark", "Serbia", "England", "Poland", "Netherlands", "Austria", "France", "Belgium", "Slovakia", "Romania", "Ukraine", "Turkey", "Georgia", "Portugal", "Czech Republic"];
    
    const usedNames = new Set();
    const usedTeams = new Set();

    // Fetch existing allocations
    const fetchAllocations = async () => {
        try {
            const response = await fetch('/.netlify/functions/getAllocations');
            const allocations = await response.json();
            allocations.forEach(({ name, team }) => {
                usedNames.add(name);
                usedTeams.add(team);
                const row = document.createElement('tr');
                const nameCell = document.createElement('td');
                const teamCell = document.createElement('td');
                nameCell.textContent = name;
                teamCell.textContent = team;
                row.appendChild(nameCell);
                row.appendChild(teamCell);
                allocationsTableBody.appendChild(row);
            });
        } catch (error) {
            console.error('Failed to fetch allocations', error);
        }
    };

    await fetchAllocations();

    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        const name = nameSelect.value;
        const question1 = document.getElementById('question1').value;
        const question2 = document.getElementById('question2').value;

        if (usedNames.has(name)) {
            resultDiv.innerHTML = `Sorry, the name ${name} has already been used.`;
            return;
        }

        let team;
        if (name === 'Jock') {
            team = 'Scotland';
        } else {
            let namePreference = preferences[name];
            let botPreference = teamPreferences[question1];
            let leaderPreference = leaderPreferences[question2];
            let selectedTeams;

            if (namePreference === "none") {
                selectedTeams = botPreference.filter(team => leaderPreference.includes(team));
            } else {
                selectedTeams = teams[namePreference].filter(team => botPreference.includes(team) && leaderPreference.includes(team));
            }

            selectedTeams = selectedTeams.filter(team => !usedTeams.has(team));

            if (selectedTeams.length === 0) {
                selectedTeams = allTeams.filter(team => !usedTeams.has(team));
            }

            team = selectedTeams[Math.floor(Math.random() * selectedTeams.length)];
        }

        usedNames.add(name);
        usedTeams.add(team);

        const row = document.createElement('tr');
        const nameCell = document.createElement('td');
        const teamCell = document.createElement('td');
        nameCell.textContent = name;
        teamCell.textContent = team;
        row.appendChild(nameCell);
        row.appendChild(teamCell);
        allocationsTableBody.appendChild(row);

        resultDiv.innerHTML = `Hi ${name}, based on your preferences, you should support ${team}!`;

        nameSelect.querySelector(`option[value="${name}"]`).remove();

        // Save allocation
        try {
            await fetch('/.netlify/functions/saveAllocations', {
                method: 'POST',
                body: JSON.stringify({ name, team })
            });
        } catch (error) {
            console.error('Failed to save allocation', error);
        }
    });
});

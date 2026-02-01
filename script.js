document.addEventListener('DOMContentLoaded', function () {
    // Seleção de elementos do DOM
    const elements = {
        palpiteIcon: document.getElementById('palpiteIcon'),
        compartilharIcon: document.getElementById('compartilharIcon'),
        hamburgerMenu: document.getElementById('hamburgerMenu'),
        expandMenu: document.getElementById('expandMenu'),
        contatoLink: document.getElementById('contatoLink'),
        instalarAppLink: document.getElementById('instalarAppLink'),
        minIcon: document.getElementById('minIcon'),
        mIcon: document.getElementById('mIcon'),
        minassIcon: document.getElementById('minassIcon'),
        minassSection: document.getElementById('minassSection'),
        minasIcon: document.getElementById('minasIcon'),
        minasSection: document.getElementById('minasSection'),
        minaIcon: document.getElementById('minaIcon'),
        minaSection: document.getElementById('minaSection'),
        modoPalpiteSection: document.getElementById('modoPalpite'),
        mostrarPalpiteBtn: document.getElementById('mostrarPalpiteBtn'),
        dropdownPalpite: document.getElementById('dropdownPalpite'),
        palpiteConteudoDiv: document.getElementById('palpiteConteudo'),
        comoFuncionaSection: document.getElementById('comoFunciona'),
        politicasPrivacidadeSection: document.getElementById('politicasPrivacidade'),
        termosServicoSection: document.getElementById('termosServico'),
        sobreSection: document.getElementById('sobre')
    };

    // Verificar se todos os elementos foram encontrados
    for (const [key, value] of Object.entries(elements)) {
        if (!value) {
            console.error(`Elemento ${key} não encontrado no DOM`);
        }
    }

    // Atribuir elementos às variáveis
    const { palpiteIcon, compartilharIcon, hamburgerMenu, expandMenu, contatoLink, instalarAppLink,
            minIcon, mIcon, minassIcon, minassSection, minasIcon, minasSection, minaIcon, minaSection,
            modoPalpiteSection, mostrarPalpiteBtn, dropdownPalpite, palpiteConteudoDiv,
            comoFuncionaSection, politicasPrivacidadeSection, termosServicoSection, sobreSection } = elements;

    // Chaves do localStorage
    const localStorageModeKey = 'appMode';
    const localStorageNameKey = 'lastSelectedName';

    // Estado atual
    let currentMode = 'Palpite';
    let deferredPrompt;

    // Função para esconder todas as seções
    function hideAllSections() {
        modoPalpiteSection.classList.add('hidden');
        comoFuncionaSection.classList.add('hidden');
        politicasPrivacidadeSection.classList.add('hidden');
        termosServicoSection.classList.add('hidden');
        sobreSection.classList.add('hidden');
        minSection.classList.add('hidden');
        mSection.classList.add('hidden');
        minassSection.classList.add('hidden');
        minasSection.classList.add('hidden');
        minaSection.classList.add('hidden');
    }

    // Função para exibir a seção selecionada
    function showSection(section) {
        if (section) {
            hideAllSections();
            section.classList.remove('hidden');
        } else {
            console.error('Seção não encontrada');
        }
    }

    // Função para definir o ícone ativo
    function setActiveIcon(activeIcon) {
        if (activeIcon) {
            [minIcon, mIcon, minassIcon, minasIcon, minaIcon, palpiteIcon, compartilharIcon].forEach(icon => {
                if (icon) icon.classList.remove('active');
            });
            activeIcon.classList.add('active');
        }
    }

    // Função para abrir opções de compartilhamento
    function abrirOpcoesCompartilhamento() {
        if (navigator.share) {
            navigator.share({
                title: document.title,
                text: 'Aumente suas chances de ganhar no Jogo do Bicho com os melhores palpites e estatísticas certeiras! Confira agora dicas valiosas para fazer sua próxima aposta vencedora!',
                url: window.location.href
            }).then(() => {
                console.log('Compartilhamento bem-sucedido');
            }).catch((error) => {
                console.log('Compartilhamento cancelado ou erro:', error);
            });
        } else {
            alert('Compartilhamento não suportado neste navegador.');
        }
    }

    // Função para popular o dropdown de palpite
    function populateDropdownPalpite() {
        if (!dropdownPalpite) return;
        dropdownPalpite.innerHTML = '<option value="" disabled selected>Escolha uma loteria</option>';
        if (!palpites || typeof palpites !== 'object') {
            console.error('Variável palpites não definida ou inválida');
            dropdownPalpite.innerHTML += '<option value="" disabled>Dados indisponíveis.</option>';
            return;
        }
        Object.keys(palpites).forEach(nome => {
            const option = document.createElement('option');
            option.value = nome;
            option.textContent = nome;
            dropdownPalpite.appendChild(option);
        });
        const lastSelectedName = localStorage.getItem(localStorageNameKey);
        if (lastSelectedName && palpites[lastSelectedName]) {
            dropdownPalpite.value = lastSelectedName;
            exibirFrasesPalpitePorCategoria(lastSelectedName);
        }
    }

    // Evento para os ícones
    if (minIcon) {
        minIcon.addEventListener('click', function (event) {
            event.preventDefault();
            console.log('minIcon clicado');
            setActiveIcon(minIcon);
            showSection(minSection);
        });
    }

    if (mIcon) {
        mIcon.addEventListener('click', function (event) {
            event.preventDefault();
            console.log('mIcon clicado');
            setActiveIcon(mIcon);
            showSection(mSection);
        });
    }

    if (minassIcon) {
        minassIcon.addEventListener('click', function (event) {
            event.preventDefault();
            console.log('minassIcon clicado');
            setActiveIcon(minassIcon);
            showSection(minassSection);
        });
    }

    if (minasIcon) {
        minasIcon.addEventListener('click', function (event) {
            event.preventDefault();
            console.log('minasIcon clicado');
            setActiveIcon(minasIcon);
            showSection(minasSection);
        });
    }

    if (minaIcon) {
        minaIcon.addEventListener('click', function (event) {
            event.preventDefault();
            console.log('minaIcon clicado');
            setActiveIcon(minaIcon);
            showSection(minaSection);
        });
    }

    if (palpiteIcon) {
        palpiteIcon.addEventListener('click', function (event) {
            event.preventDefault();
            console.log('palpiteIcon clicado');
            currentMode = 'Palpite';
            localStorage.setItem(localStorageModeKey, 'Palpite');
            setActiveIcon(palpiteIcon);
            showSection(modoPalpiteSection);
            populateDropdownPalpite();
        });
    }

    if (compartilharIcon) {
        compartilharIcon.addEventListener('click', function (event) {
            event.preventDefault();
            console.log('compartilharIcon clicado');
            abrirOpcoesCompartilhamento();
        });
    }

    // Função para exibir as frases nas abas em formato de cards
    function exibirFrasesPalpitePorCategoria(nome) {
        const milharDiv = document.getElementById('milhar');
        const centenaDiv = document.getElementById('centena');
        const dezenaDiv = document.getElementById('dezena');
        if (!milharDiv || !centenaDiv || !dezenaDiv) return;

        milharDiv.innerHTML = '';
        centenaDiv.innerHTML = '';
        dezenaDiv.innerHTML = '';

        let milharCount = 0;
        let centenaCount = 0;
        let dezenaCount = 0;

        if (!palpites || !palpites[nome] || !palpites[nome].frases) {
            console.error(`Dados de palpites para ${nome} não disponíveis`);
            return;
        }

        palpites[nome].frases.forEach(frase => {
            const card = document.createElement('div');
            card.classList.add('frase-palpite-card');
            const p = document.createElement('p');
            p.textContent = frase;
            card.appendChild(p);

            if (frase.includes('Milhar')) {
                milharDiv.appendChild(card);
                milharCount++;
            } else if (frase.includes('Centena')) {
                centenaDiv.appendChild(card);
                centenaCount++;
            } else if (frase.includes('Dezena')) {
                dezenaDiv.appendChild(card);
                dezenaCount++;
            }
        });

        const milharCountEl = document.getElementById('milharCount');
        const centenaCountEl = document.getElementById('centenaCount');
        const dezenaCountEl = document.getElementById('dezenaCount');
        if (milharCountEl) milharCountEl.textContent = milharCount;
        if (centenaCountEl) centenaCountEl.textContent = centenaCount;
        if (dezenaCountEl) dezenaCountEl.textContent = dezenaCount;

        const acertosPrevisoesTitulo = document.getElementById('acertosPrevisoesTitulo');
        const palpiteAbas = document.getElementById('palpiteAbas');
        if (acertosPrevisoesTitulo) acertosPrevisoesTitulo.classList.remove('hidden');
        if (palpiteAbas) palpiteAbas.classList.remove('hidden');
    }

    // Função para controlar a troca de abas
    document.querySelectorAll('.tab-link').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelectorAll('.tab-link').forEach(tab => tab.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => content.classList.add('hidden'));
            this.classList.add('active');
            const tabId = this.getAttribute('data-tab');
            const tabContent = document.getElementById(tabId);
            if (tabContent) tabContent.classList.remove('hidden');
            const tabList = document.querySelector('.tab-list');
            if (tabList) {
                tabList.classList.remove('active-milhar', 'active-centena', 'active-dezena');
                if (tabId === 'milhar') {
                    tabList.classList.add('active-milhar');
                } else if (tabId === 'centena') {
                    tabList.classList.add('active-centena');
                } else if (tabId === 'dezena') {
                    tabList.classList.add('active-dezena');
                }
            }
        });
    });

    const tabelaGrupos = {
        1: { nome: 'Avestruz', emoji: '🦩' },
        2: { nome: 'Águia', emoji: '🦅' },
        3: { nome: 'Burro', emoji: '🐴' },
        4: { nome: 'Borboleta', emoji: '🦋' },
        5: { nome: 'Cachorro', emoji: '🐶' },
        6: { nome: 'Cabra', emoji: '🐐' },
        7: { nome: 'Carneiro', emoji: '🐏' },
        8: { nome: 'Camelo', emoji: '🐫' },
        9: { nome: 'Cobra', emoji: '🐍' },
        10: { nome: 'Coelho', emoji: '🐰' },
        11: { nome: 'Cavalo', emoji: '🐎' },
        12: { nome: 'Elefante', emoji: '🐘' },
        13: { nome: 'Galo', emoji: '🐓' },
        14: { nome: 'Gato', emoji: '🐱' },
        15: { nome: 'Jacaré', emoji: '🐊' },
        16: { nome: 'Leão', emoji: '🦁' },
        17: { nome: 'Macaco', emoji: '🐒' },
        18: { nome: 'Porco', emoji: '🐖' },
        19: { nome: 'Pavão', emoji: '🦚' },
        20: { nome: 'Peru', emoji: '🦃' },
        21: { nome: 'Touro', emoji: '🐂' },
        22: { nome: 'Tigre', emoji: '🐯' },
        23: { nome: 'Urso', emoji: '🐻' },
        24: { nome: 'Veado', emoji: '🦌' },
        25: { nome: 'Vaca', emoji: '🐄' }
    };

    function exibirPalpitesComLoading(nome) {
        if (!palpiteConteudoDiv) return;
        palpiteConteudoDiv.innerHTML = '';
        const loader = document.createElement('div');
        loader.classList.add('loader');
        palpiteConteudoDiv.appendChild(loader);
        setTimeout(() => {
            loader.remove();
            const fraseP = document.createElement('p');
            fraseP.textContent = `Aposte os números abaixo na loteria ${nome}.`;
            fraseP.classList.add('frase-palpite');
            palpiteConteudoDiv.appendChild(fraseP);
            const botoesCategorias = document.createElement('div');
            botoesCategorias.classList.add('botoes-categorias');
            function criarBotao(texto, categoriaId) {
                const botao = document.createElement('button');
                botao.textContent = texto;
                botao.addEventListener('click', () => {
                    mostrarCategoria(categoriaId);
                    document.querySelectorAll('.botoes-categorias button').forEach(b => b.classList.remove('ativo'));
                    botao.classList.add('ativo');
                });
                return botao;
            }
            const botaoMilhar = criarBotao('M/MC', 'Milhar');
            const botaoCentena = criarBotao('C', 'Centena');
            const botaoDezena = criarBotao('D', 'Dezena');
            const botaoGrupo = criarBotao('G', 'Grupo');
            botoesCategorias.append(botaoMilhar, botaoCentena, botaoDezena, botaoGrupo);
            palpiteConteudoDiv.appendChild(botoesCategorias);
            const dadosPalpite = palpites[nome];
            if (!dadosPalpite) {
                palpiteConteudoDiv.textContent = 'Dados indisponíveis.';
                return;
            }
            const milhares = [...new Set(dadosPalpite.palpites)];
            const centenas = [...new Set(milhares.map(num => num.slice(1)))];
            const dezenas = [...new Set(milhares.map(num => num.slice(2)))];
            const grupos = gerarGruposFrequentes(dadosPalpite.palpites);
            criarSecaoPalpite(milhares, 'Milhar');
            criarSecaoPalpite(centenas, 'Centena');
            criarSecaoPalpite(dezenas, 'Dezena');
            criarSecaoPalpite(grupos, 'Grupo');
            mostrarCategoria('Milhar');
            botaoMilhar.classList.add('ativo');
        }, 2000);
    }

    function mostrarCategoria(categoria) {
        document.querySelectorAll('.cards-container').forEach(div => {
            div.style.display = 'none';
        });
        const categoriaDiv = document.getElementById(`secao-${categoria}`);
        if (categoriaDiv) categoriaDiv.style.display = 'flex';
    }

    function criarSecaoPalpite(numeros, id) {
        const sectionDiv = document.createElement('div');
        sectionDiv.classList.add('cards-container');
        sectionDiv.id = `secao-${id}`;
        numeros.forEach(numero => {
            const cardDiv = document.createElement('div');
            cardDiv.classList.add('card-palpite');
            cardDiv.textContent = numero;
            sectionDiv.appendChild(cardDiv);
        });
        sectionDiv.style.display = 'none';
        palpiteConteudoDiv.appendChild(sectionDiv);
    }

    function gerarGruposFrequentes(palpites) {
        const grupoContagem = {};
        palpites.forEach(num => {
            const grupoNum = Math.ceil(parseInt(num.slice(2)) / 4);
            if (tabelaGrupos[grupoNum]) {
                grupoContagem[grupoNum] = (grupoContagem[grupoNum] || 0) + 1;
            }
        });
        return Object.entries(grupoContagem)
            .filter(([_, count]) => count >= 2)
            .map(([grupoNum, _]) => `${grupoNum} - ${tabelaGrupos[grupoNum].nome} ${tabelaGrupos[grupoNum].emoji}`);
    }

    function exibirMensagemFlutuante(mensagem) {
        const fundoDiv = document.createElement('div');
        fundoDiv.style.position = 'fixed';
        fundoDiv.style.top = '0';
        fundoDiv.style.left = '0';
        fundoDiv.style.width = '100%';
        fundoDiv.style.height = '100%';
        fundoDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        fundoDiv.style.zIndex = '999';
        fundoDiv.style.backdropFilter = 'blur(5px)';
        fundoDiv.style.display = 'flex';
        fundoDiv.style.justifyContent = 'center';
        fundoDiv.style.alignItems = 'center';
        const mensagemDiv = document.createElement('div');
        mensagemDiv.style.padding = '15px';
        mensagemDiv.style.width = '300px';
        mensagemDiv.style.backgroundColor = '#333';
        mensagemDiv.style.color = '#fff';
        mensagemDiv.style.borderRadius = '8px';
        mensagemDiv.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
        mensagemDiv.style.zIndex = '1000';
        mensagemDiv.style.position = 'relative';
        mensagemDiv.innerHTML = `<p>${mensagem}</p>`;
        const okBtn = document.createElement('button');
        okBtn.textContent = 'OK';
        okBtn.style.marginTop = '10px';
        okBtn.style.padding = '5px 10px';
        okBtn.style.background = '#ffdd57';
        okBtn.style.color = '#333';
        okBtn.style.border = 'none';
        okBtn.style.borderRadius = '5px';
        okBtn.style.cursor = 'pointer';
        okBtn.addEventListener('click', () => {
            fundoDiv.remove();
            document.body.classList.remove('no-scroll');
        });
        mensagemDiv.appendChild(okBtn);
        fundoDiv.appendChild(mensagemDiv);
        document.body.appendChild(fundoDiv);
        document.body.classList.add('no-scroll');
    }

    const style = document.createElement('style');
    style.innerHTML = `
        .no-scroll {
            overflow: hidden;
        }
    `;
    document.head.appendChild(style);

    function alert(mensagem) {
        exibirMensagemFlutuante(mensagem);
    }

    if (mostrarPalpiteBtn) {
        mostrarPalpiteBtn.addEventListener('click', function () {
            const selectedName = dropdownPalpite.value;
            if (!selectedName) {
                alert("Por favor, selecione uma loteria primeiro.");
                return;
            }
            if (!palpites || !palpites[selectedName]) {
                alert("Dados para a loteria selecionada não estão disponíveis.");
                return;
            }
            if (canShowPalpite()) {
                exibirPalpitesComLoading(selectedName);
            } else {
                createModal();
            }
        });
    }

    if (dropdownPalpite) {
        dropdownPalpite.addEventListener('change', function () {
            const selectedName = this.value;
            localStorage.setItem(localStorageNameKey, selectedName);
            exibirFrasesPalpitePorCategoria(selectedName);
            palpiteConteudoDiv.innerHTML = '';
        });
    }

    function canShowPalpite() {
        const hasPrivilege = localStorage.getItem('privilegeAccess') === 'true';
        return hasPrivilege;
    }

    function checkPrivilegeAccess() {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('access') === 'privileged') {
            localStorage.setItem('privilegeAccess', 'true');
            const newUrl = window.location.origin + window.location.pathname;
            window.history.replaceState({}, document.title, newUrl);
        }
    }

    function mostrarMensagemFlutuante() {
        const hasPrivilege = localStorage.getItem('privilegeAccess') === 'true';
        if (!hasPrivilege) {
            const mensagemFlutuante = document.getElementById('mensagemFlutuante');
            if (mensagemFlutuante) mensagemFlutuante.classList.remove('hidden');
        }
    }

    function fecharMensagemFlutuante() {
        const mensagemFlutuante = document.getElementById('mensagemFlutuante');
        if (mensagemFlutuante) mensagemFlutuante.classList.add('hidden');
    }

    if (fecharMensagemBtn) {
        fecharMensagemBtn.addEventListener('click', fecharMensagemFlutuante);
    }

    setTimeout(mostrarMensagemFlutuante, 30000);

    checkPrivilegeAccess();

    if (hamburgerMenu) {
        hamburgerMenu.addEventListener('click', function () {
            if (expandMenu) {
                expandMenu.classList.toggle('hidden');
                expandMenu.classList.toggle('active');
            }
        });
    }

    function fecharMenuAoRolar() {
        if (expandMenu && expandMenu.classList.contains('active')) {
            expandMenu.classList.remove('active');
            expandMenu.classList.add('hidden');
        }
    }

    window.addEventListener('scroll', fecharMenuAoRolar);

    if (expandMenu) {
        expandMenu.addEventListener('click', function (event) {
            if (event.target.tagName === 'A') {
                const sectionId = event.target.getAttribute('data-section');
                if (sectionId) {
                    const section = document.getElementById(sectionId);
                    if (section) {
                        showSection(section);
                    }
                }
                expandMenu.classList.add('hidden');
                expandMenu.classList.remove('active');
            }
        });
    }

    if (contatoLink) {
        contatoLink.addEventListener('click', function (event) {
            event.preventDefault();
            window.open('https://www.instagram.com/acertosonline/', '_blank');
            if (expandMenu) {
                expandMenu.classList.add('hidden');
                expandMenu.classList.remove('active');
            }
        });
    }

    if (instalarAppLink) {
        instalarAppLink.addEventListener('click', function (event) {
            event.preventDefault();
            instalarApp();
            if (expandMenu) {
                expandMenu.classList.add('hidden');
                expandMenu.classList.remove('active');
            }
        });
    }

    function instalarApp() {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('Usuário aceitou a instalação do App');
                } else {
                    console.log('Usuário recusou a instalação do App');
                }
                deferredPrompt = null;
            });
        } else {
            alert('A funcionalidade de instalação não está disponível no seu navegador.');
        }
    }

    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/service-worker.js')
                .then(registration => {
                    console.log('ServiceWorker registrado com sucesso:', registration.scope);
                })
                .catch(error => {
                    console.log('Falha ao registrar ServiceWorker:', error);
                });
        });
    }

    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
    });

    function initializeApp() {
        try {
            hideAllSections();
            if (dropdownPalpite) {
                populateDropdownPalpite();
            } else {
                console.error('dropdownPalpite não encontrado');
            }
            if (palpiteIcon && modoPalpiteSection) {
                palpiteIcon.click();
            } else {
                console.error('palpiteIcon ou modoPalpiteSection não encontrado');
                if (modoPalpiteSection) {
                    showSection(modoPalpiteSection);
                }
            }
        } catch (error) {
            console.error('Erro na inicialização:', error);
        }
    }

    initializeApp();
});

// env.js
// ==========================================================================================
// ATENÇÃO: SUBSTITUA 'SUA_CHAVE_API_AQUI_SUBSTITUA_ME' PELA SUA CHAVE REAL DA API GEMINI.
// ==========================================================================================
//
// IMPORTANTE SOBRE SEGURANÇA:
// Em um ambiente de desenvolvimento local ou para demonstrações onde não há um backend,
// esta é uma forma de separar a chave do código principal. No entanto, a chave AINDA
// ESTARÁ VISÍVEL NO CÓDIGO-FONTE DO NAVEGADOR se esta aplicação for hospedada como está.
//
// Para aplicações em PRODUÇÃO, NUNCA exponha sua chave de API diretamente no código do cliente.
// Utilize um backend (como um servidor Node.js, Python, ou Funções Serverless) para
// atuar como um proxy: o frontend chama seu backend, e o backend (que guarda a chave
// de forma segura) chama a API Gemini.
//
// Se você usar um sistema de versionamento como Git, adicione este arquivo (env.js)
// ao seu .gitignore para evitar commitar sua chave de API acidentalmente.
//
// ==========================================================================================

window.process = {
  env: {
    API_KEY: 'AIzaSyB-WweHwAVBmhQ4_pgnasnV1M6AggVjpzc' // <<<<<<< COLOQUE SUA CHAVE REAL AQUI
  }
};

// Log para confirmar que o arquivo foi carregado (apenas para desenvolvimento)
console.log("env.js loaded: API_KEY setup (simulated for client-side). Ensure you've replaced the placeholder with your actual key.");

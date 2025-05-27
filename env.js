// env.js
// ==========================================================================================
// ATENÇÃO: A CHAVE ABAIXO É A CHAVE DE PRODUÇÃO FORNECIDA.
// ==========================================================================================
//
// IMPORTANTE SOBRE SEGURANÇA:
// Em um ambiente de desenvolvimento local ou para demonstrações onde não há um backend,
// esta é uma forma de separar a chave do código principal. No entanto, a chave AINDA
// ESTARÁ VISÍVEL NO CÓDIGO-FONTE DO NAVEGADOR se esta aplicação for hospedada como está.
//
// Para aplicações em PRODUÇÃO com dados sensíveis ou em larga escala, NUNCA exponha sua
// chave de API diretamente no código do cliente. Utilize um backend (como um servidor
// Node.js, Python, ou Funções Serverless) para atuar como um proxy: o frontend chama
// seu backend, e o backend (que guarda a chave de forma segura) chama a API Gemini.
//
// Se você usar um sistema de versionamento como Git, adicione este arquivo (env.js)
// ao seu .gitignore para evitar commitar sua chave de API acidentalmente.
//
// ==========================================================================================

window.process = {
  env: {
    API_KEY: 'AIzaSyB-WweHwAVBmhQ4_pgnasnV1M6AggVjpzc' // Chave de produção fornecida.
  }
};

// Aviso importante sobre a chave de API em produção client-side.
console.warn(
  "env.js loaded: API_KEY está configurada. Lembre-se das implicações de segurança ao expor chaves de API no client-side para aplicações de produção em larga escala. Considere um backend como proxy."
);
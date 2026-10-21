// Captura as <figure> de uma página com o WebKit do sistema — o motor do
// Safari. O Chrome do `conferir-figuras.mjs` não mostra os defeitos que só o
// Safari tem (KaTeX dentro de <foreignObject> fora de escala e de lugar foi o
// primeiro deles), então a conferência precisa dos dois.
//
// Uso: swift scripts/capturar-safari.swift <url> <largura> <pasta> <prefixo>
// Grava <pasta>/<NN>-<prefixo>.png, uma por figura, e imprime quantas gravou.

import AppKit
import WebKit

let args = CommandLine.arguments
guard args.count == 5, let width = Double(args[2]) else {
  FileHandle.standardError.write("uso: capturar-safari.swift <url> <largura> <pasta> <prefixo>\n".data(using: .utf8)!)
  exit(2)
}
let url = URL(string: args[1])!
let outDir = args[3]
let suffix = args[4]

final class Capturador: NSObject, WKNavigationDelegate {
  let web: WKWebView
  let window: NSWindow

  init(width: Double) {
    let frame = NSRect(x: 0, y: 0, width: width, height: 900)
    web = WKWebView(frame: frame, configuration: WKWebViewConfiguration())
    // A janela fica fora da tela: o WebKit só pinta o que está numa janela.
    window = NSWindow(contentRect: frame, styleMask: [.borderless], backing: .buffered, defer: false)
    window.setFrameOrigin(NSPoint(x: -20000, y: -20000))
    window.contentView = web
    window.orderBack(nil)
    super.init()
    web.navigationDelegate = self
  }

  func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
    // Abre os blocos recolhidos e espera as fontes. Clicar no <summary> não
    // serve: a janela fica fora da tela, o WebKit não roda a animação que abre
    // o bloco, e ele fica com altura zero. Então o bloco é aberto à mão.
    let js = """
      await new Promise(r => setTimeout(r, 1500));
      document.querySelectorAll('article details').forEach(d => {
        d.setAttribute('open', '');
        for (const c of d.children) if (c.tagName !== 'SUMMARY') c.removeAttribute('style');
      });
      await document.fonts.ready;
      await new Promise(r => setTimeout(r, 1000));
      return document.documentElement.scrollHeight;
      """
    webView.callAsyncJavaScript(js, arguments: [:], in: nil, in: .page) { result in
      guard case .success(let h) = result, let height = h as? Double else { self.falha(result); return }
      // A página inteira na janela, para cada figura estar pintada.
      let frame = NSRect(x: 0, y: 0, width: self.web.frame.width, height: height)
      self.window.setContentSize(frame.size)
      self.web.frame = frame
      DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) { self.capturar() }
    }
  }

  func falha(_ r: Any) {
    FileHandle.standardError.write("falhou: \(r)\n".data(using: .utf8)!)
    exit(1)
  }

  func capturar() {
    let js = """
      return [...document.querySelectorAll('article figure')]
        .map(f => f.getBoundingClientRect())
        .filter(r => r.width > 0 && r.height > 0)
        .map(r => [r.left + scrollX, r.top + scrollY, r.width, r.height]);
      """
    web.callAsyncJavaScript(js, arguments: [:], in: nil, in: .page) { result in
      guard case .success(let v) = result, let rects = v as? [[Double]] else { self.falha(result); return }
      self.salvar(rects, 0)
    }
  }

  func salvar(_ rects: [[Double]], _ i: Int) {
    if i == rects.count {
      print(rects.count)
      exit(0)
    }
    let r = rects[i]
    let config = WKSnapshotConfiguration()
    config.rect = NSRect(x: r[0], y: r[1], width: r[2], height: r[3])
    config.snapshotWidth = NSNumber(value: r[2])
    web.takeSnapshot(with: config) { image, error in
      guard let image, let tiff = image.tiffRepresentation,
        let png = NSBitmapImageRep(data: tiff)?.representation(using: .png, properties: [:])
      else { self.falha(error as Any); return }
      let name = String(format: "%02d-%@.png", i + 1, suffix)
      try! png.write(to: URL(fileURLWithPath: outDir).appendingPathComponent(name))
      self.salvar(rects, i + 1)
    }
  }
}

let app = NSApplication.shared
app.setActivationPolicy(.prohibited)
let capturador = Capturador(width: width)
capturador.web.load(URLRequest(url: url))
DispatchQueue.main.asyncAfter(deadline: .now() + 60) {
  FileHandle.standardError.write("tempo esgotado\n".data(using: .utf8)!)
  exit(1)
}
app.run()

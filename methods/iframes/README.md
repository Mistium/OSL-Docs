---
hidden: true
---

# Iframes

> **Legacy (originOS).** Iframes embedded live web content inside an originOS
> window. The OSL CLI has no embedded browser, so these methods do not exist in it.
> These pages are kept for reference.

An iframe is created by calling `.iframeNew()` on a URL string, which returns an
iframe id. The remaining methods are called on that id to position, show, navigate
and close it:

| Method | Purpose |
| --- | --- |
| `.iframeNew()` | Create an iframe for a URL, returns its id |
| `.iframeShow()` | Make the iframe visible |
| `.iframeHide()` | Hide the iframe without destroying it |
| `.iframeGoto()` | Move the iframe to a screen position |
| `.iframeResize()` | Set the iframe's width and height |
| `.iframeRedirect()` | Load a different URL in the iframe |
| `.iframeClose()` | Destroy the iframe |

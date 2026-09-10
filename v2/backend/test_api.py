import urllib.request
import json

boundary = "TestBoundary123"
CRLF = b"\r\n"

parts = []
# File field
parts.append(b"--" + boundary.encode() + CRLF)
parts.append(b'Content-Disposition: form-data; name="document"; filename="test.txt"' + CRLF)
parts.append(b"Content-Type: text/plain" + CRLF)
parts.append(CRLF)
parts.append(b"dummy document content" + CRLF)
# document_type field
parts.append(b"--" + boundary.encode() + CRLF)
parts.append(b'Content-Disposition: form-data; name="document_type"' + CRLF)
parts.append(CRLF)
parts.append(b"passport" + CRLF)
# demo_mode field
parts.append(b"--" + boundary.encode() + CRLF)
parts.append(b'Content-Disposition: form-data; name="demo_mode"' + CRLF)
parts.append(CRLF)
parts.append(b"genuine" + CRLF)
# closing boundary
parts.append(b"--" + boundary.encode() + b"--" + CRLF)

body = b"".join(parts)

req = urllib.request.Request(
    "http://localhost:8000/api/screen",
    data=body,
    headers={"Content-Type": f"multipart/form-data; boundary={boundary}"},
    method="POST"
)
try:
    resp = urllib.request.urlopen(req)
    data = json.loads(resp.read())
    print("SUCCESS - Screen result:")
    print(json.dumps(data, indent=2))
except Exception as e:
    print(f"ERROR: {e}")

# Test tampered demo
parts2 = []
for name, value in [("document_type", "passport"), ("demo_mode", "tampered")]:
    parts2.append(b"--" + boundary.encode() + CRLF)
    parts2.append(f'Content-Disposition: form-data; name="{name}"'.encode() + CRLF)
    parts2.append(CRLF)
    parts2.append(value.encode() + CRLF)
parts2.append(b"--" + boundary.encode() + CRLF)
parts2.append(b'Content-Disposition: form-data; name="document"; filename="test.txt"' + CRLF)
parts2.append(b"Content-Type: text/plain" + CRLF)
parts2.append(CRLF)
parts2.append(b"dummy" + CRLF)
parts2.append(b"--" + boundary.encode() + b"--" + CRLF)

body2 = b"".join(parts2)
req2 = urllib.request.Request(
    "http://localhost:8000/api/screen",
    data=body2,
    headers={"Content-Type": f"multipart/form-data; boundary={boundary}"},
    method="POST"
)
try:
    resp2 = urllib.request.urlopen(req2)
    data2 = json.loads(resp2.read())
    print("\nSUCCESS - Tampered demo:")
    print(f"  Risk Score: {data2['risk']['score']} ({data2['risk']['level']})")
    print(f"  Tampering: {data2['tampering']['score']}%")
    print(f"  Face: {data2['face']['status']}")
except Exception as e:
    print(f"Tampered ERROR: {e}")

# Troubleshooting

Common issues and solutions for DClaw Energy.

## Quick Diagnostics

```bash
# Check app pods
kubectl get pods -n dclaw-energy

# Check logs
kubectl logs -n dclaw-energy deployment/dclaw-energy-backend

# Check database
kubectl get clusters -n dclaw-energy
```

## Sections

- [Common Issues](./common-issues)
- [FAQ](./faq)

import { Info, KeyRound } from "lucide-react";
import { useOS } from "../../core/OSContext";
import { appRegistry } from "../../core/appRegistry";

export default function PermissionDialog() {
  const { state, resolvePermission } = useOS();
  const request = state.permissionQueue[0];
  if (!request) return null;
  return (
    <div className="permission-overlay">
      <section className="permission-dialog" role="alertdialog" aria-modal="true">
        <div className="permission-icon"><KeyRound size={18} strokeWidth={1.5} /></div>
        <h2>Permission requested</h2>
        <p>{appRegistry[request.appId].name} wants to perform <strong>{request.permission}</strong>.</p>
        <div className="permission-reason">{request.reason}</div>
        <div className="permission-resources"><span>Resources</span>{request.resources.map((resource) => <code key={resource}>{resource}</code>)}</div>
        <div className="permission-note"><span><Info size={13} strokeWidth={1.5} /></span><p>Z++ requires explicit approval before sensitive actions.</p></div>
        <div className="permission-actions"><button className="button-secondary" onClick={() => resolvePermission(request.id, false)}>Deny</button><button className="button-primary" onClick={() => resolvePermission(request.id, true)}>Allow</button></div>
      </section>
    </div>
  );
}

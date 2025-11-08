import type { SessionData } from "@/lib/session";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { sessionOptions } from "@/lib/session";
import { notFound, redirect } from "next/navigation";
import StatePickerClient from "./StatePickerClient";
import Script from "next/script";
import Link from "next/link";

async function getUserAndBookings(id: string, cookieHeader: string) {
  const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const r = await fetch(`${base}/api/admin/users/${id}`, {
    cache: "no-store",
    headers: { cookie: cookieHeader },
  });
  if (r.status === 404) return null;
  if (!r.ok) throw new Error("Failed to load user");
  return r.json();
}

export const dynamic = "force-dynamic";

export default async function AdminUserProfile({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(
    cookieStore,
    sessionOptions as any
  );
  if (session?.user?.role !== "ADMIN") redirect("/admin");

  // Next 15: params is a Promise in server components
  const { id: userId } = await params;

  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");
  const data = await getUserAndBookings(userId, cookieHeader);
  if (!data) notFound();

  const {
    user,
    bookings,
    comments: apiComments,
  } = data as {
    user: any;
    bookings: any[];
    comments?: Array<{ id: string; text: string; createdAt: string }>;
  };

  const comments = apiComments ?? [];

  return (
    <main className="min-h-[calc(100vh-7rem)] px-4 py-2">
      <div className="mx-auto max-w-5xl space-y-5">
        {/* Header & details */}
        <div className="panel">
          <div className="flex items-center justify-between gap-3 flex-wrap md:flex-nowrap">
            <h1 className="min-w-0 truncate text-2xl font-semibold text-[color:var(--g600)]">
              {(user.firstName || "—") + " " + (user.lastName || "")}
              <span className="opacity-60 text-lg"> • {user.email || "—"}</span>
            </h1>
            <div className="shrink-0 flex items-center gap-2">
              <button
                id="delete-user-btn"
                type="button"
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-red-700 border border-red-300 hover:bg-red-50 active:bg-red-100 transition"
                data-action="delete-user"
                data-user-id={user.id}
              >
                Delete user
              </button>
              <Link href="/admin/users" className="btn">
                Back
              </Link>
            </div>
          </div>

          {/* Details grid */}
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg ring-1 ring-slate-200 bg-white p-3">
              <div className="text-xs opacity-60">Email</div>
              <div className="font-medium break-all">{user.email ?? "—"}</div>
            </div>
            <div className="rounded-lg ring-1 ring-slate-200 bg-white p-3">
              <div className="text-xs opacity-60">Phone</div>
              <div className="font-medium">{user.phone ?? "—"}</div>
            </div>

            {/* State (left) */}
            <div className="rounded-lg ring-1 ring-slate-200 bg-white p-3">
              <div className="text-xs opacity-60 ">State</div>
              <StatePickerClient userId={user.id} initialState={user.state} />
              <div
                id="flash-banner"
                className="hidden rounded-xl border p-2 text-sm font-medium mt-2"
                role="status"
                aria-live="polite"
              >
                <span id="flash-text"></span>
              </div>
            </div>

            {/* Add comment (right) */}
            <div className="rounded-lg ring-1 ring-slate-200 bg-white p-3">
              <div className="text-xs opacity-60 ">Add comment</div>
              <form id="user-comment-form" className="flex items-start gap-2">
                <textarea
                  id="user-comment-text"
                  className="input h-24 min-h-[96px] max-h-40 resize-y w-[70%]"
                  placeholder="Add an internal note about this user"
                  maxLength={2000}
                />
                <button
                  type="submit"
                  className="btn mt-14"
                  aria-label="Add comment"
                >
                  Save
                </button>
              </form>
              <div
                id="comment-flash"
                className="hidden rounded-xl border p-2 text-sm font-medium mt-2"
                role="status"
                aria-live="polite"
              >
                <span id="comment-flash-text"></span>
              </div>
            </div>
          </div>
        </div>

        {/* Comment history */}
        <div className="panel">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-[color:var(--g600)]">
              Comment history
            </h3>
            <span
              id="comment-global-flash"
              className="hidden text-sm font-medium px-2 py-1 rounded-md"
              aria-live="polite"
            />
          </div>

          <div className="rounded-xl border border-slate-200 bg-white/70 shadow-sm ring-1 ring-black/5 p-3 overflow-auto max-h-[min(22vh,calc(100vh-18rem))]">
            {comments.length === 0 ? (
              <p id="comment-empty" className="text-sm opacity-80">
                No comments yet for this user.
              </p>
            ) : (
              <ul id="comment-list" className="space-y-3">
                {comments.map((c) => (
                  <li
                    key={c.id}
                    data-id={c.id}
                    className="w-full rounded-xl border border-slate-200 bg-white p-4 hover:shadow-sm transition"
                  >
                    <div className="flex gap-4 items-start justify-between">
                      <div className="min-w-0 flex-1">
                        <div
                          data-role="comment-body"
                          className="leading-relaxed whitespace-pre-wrap text-slate-800 text-[15px]"
                        >
                          {c.text}
                        </div>
                        <div className="mt-1 text-xs text-slate-500">
                          {new Date(c.createdAt).toLocaleString()}
                        </div>
                      </div>

                      <div className="shrink-0 w-[260px]">
                        <div className="flex items-center justify-end gap-2">
                          <label
                            htmlFor={`code-${c.id}`}
                            className="text-xs text-slate-600"
                          >
                            Code
                          </label>
                          <input
                            id={`code-${c.id}`}
                            data-role="delete-code"
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            autoComplete="off"
                            autoCorrect="off"
                            autoCapitalize="none"
                            spellCheck={false}
                            name="cv_admin_delete_code"
                            className="input h-8 w-24 mb-2 no-contacts"
                            placeholder="1234"
                            aria-label="Verification code"
                          />
                          <button
                            type="button"
                            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-red-700 border border-red-300 hover:bg-red-50 active:bg-red-100 transition"
                            data-action="delete"
                            data-id={c.id}
                            aria-label="Delete comment"
                            title="Delete comment"
                          >
                            <svg
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              className="h-4 w-4"
                            >
                              <path d="M7.5 2a1 1 0 00-.894.553L6.118 4H3.5a.5.5 0 000 1h.528l.846 10.153A2 2 0 006.866 17h6.268a2 2 0 001.992-1.847L15.972 5H16.5a.5.5 0 000-1h-2.618l-.488-1.447A1 1 0 0011.5 2h-4zM8 7a.5.5 0 011 0v6a.5.5 0 01-1 0V7zm3 0a.5.5 0 011 0v6a.5.5 0 01-1 0V7z" />
                            </svg>
                            Delete
                          </button>
                        </div>
                        <span
                          data-role="code-error"
                          className="mt-3 text-right text-xs px-2 py-1 rounded-md border hidden border-red-200 bg-red-50 text-red-700"
                          aria-live="polite"
                        />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Bookings */}
        <div className="panel">
          <h3 className="font-medium text-[color:var(--g600)] mb-3">
            Bookings (latest 100)
          </h3>
          <div className="rounded-xl border border-slate-200 bg-white/70 shadow-sm ring-1 ring-black/5 p-3 overflow-auto max-h-[min(29vh,calc(100vh-18rem))]">
            <div className="space-y-3">
              {bookings.map((b: any) => {
                const start = new Date(b.startTime);
                const end = new Date(b.endTime);
                const ok = b.status === "CONFIRMED";
                const note = b.comment || b.cancelReason || "";
                return (
                  <div
                    key={b.id}
                    className="card bg-[linear-gradient(180deg,#ffffff_0%,#f7faf7_100%)]"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={`h-2.5 w-2.5 rounded-full ${
                            ok ? "bg-[color:var(--g600)]" : "bg-red-500"
                          }`}
                        />
                        <div className="font-semibold">
                          {b.bay?.name} • {b.service?.name}
                        </div>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium shadow ${
                            ok
                              ? "bg-[color:var(--g50)] text-[color:var(--g600)]"
                              : "bg-red-50 text-red-700"
                          }`}
                        >
                          {b.status.toLowerCase()}
                        </span>
                      </div>
                      <div className="text-sm opacity-80">
                        {start.toLocaleString()} – {end.toLocaleTimeString()}
                      </div>
                    </div>
                    {note && (
                      <div className="mt-2 text-xs rounded-lg border border-slate-200 bg-white p-2">
                        <span className="font-semibold">Note:</span>{" "}
                        <span className="opacity-80">{note}</span>
                      </div>
                    )}
                  </div>
                );
              })}
              {bookings.length === 0 && (
                <p className="text-sm opacity-80">This user has no bookings.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete User Modal */}
      <div
        id="delete-user-modal"
        className="fixed inset-0 z-50 hidden items-center justify-center"
      >
        <div
          className="absolute inset-0 bg-black/30"
          data-role="backdrop"
        ></div>
        <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-5 shadow-xl ring-1 ring-black/10">
          <h4 className="text-lg font-semibold text-slate-800 mb-2">
            Confirm delete
          </h4>
          <p className="text-sm text-slate-700">
            Please enter the verification code to delete this user.{" "}
            <strong>All user-related records will be deleted.</strong>
          </p>
          <div className="mt-3 flex items-center gap-2">
            <label className="text-xs text-slate-600">Code</label>
            <input
              id="delete-user-code"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="none"
              spellCheck={false}
              className="input h-9 w-28"
              placeholder="1234"
              aria-label="Verification code"
            />
          </div>
          <div
            id="delete-user-error"
            className="mt-2 hidden text-xs px-2 py-1 rounded-md border border-red-200 bg-red-50 text-red-700"
          ></div>

          <div className="mt-4 flex items-center justify-end gap-2">
            <button
              type="button"
              id="delete-user-cancel"
              className="rounded-lg px-3 py-2 text-sm font-medium border border-slate-200 text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="button"
              id="delete-user-confirm"
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-red-700 border border-red-300 hover:bg-red-50 active:bg-red-100"
            >
              Delete user
            </button>
          </div>
        </div>
      </div>

      {/* State flash script */}
      <Script id="admin-user-state-flash" strategy="afterInteractive">
        {`
          (function () {
            function show(kind, text) {
              var root = document.getElementById('flash-banner');
              var txt  = document.getElementById('flash-text');
              if (!root || !txt) return;
              txt.textContent = text || '';
              root.classList.remove('hidden','border-red-200','bg-red-50','text-red-800','border-emerald-200','bg-emerald-50','text-emerald-800');
              if (kind === 'success') root.classList.add('border-emerald-200','bg-emerald-50','text-emerald-800');
              else root.classList.add('border-red-200','bg-red-50','text-red-800');
              clearTimeout(window.__stateFlashTimer);
              window.__stateFlashTimer = setTimeout(function(){ root.classList.add('hidden'); }, 2500);
            }
            window.addEventListener('statepicker:saved', function (e) {
              var msg = (e && e.detail && e.detail.message) || 'User state updated successfully.';
              show('success', msg);
            });
            window.addEventListener('statepicker:error', function (e) {
              var msg = (e && e.detail && e.detail.message) || 'Could not update user state.';
              show('error', msg);
            });
          })();
        `}
      </Script>

      {/* Comments + delete user scripts */}
      <Script id="admin-user-comments" strategy="afterInteractive">
        {`
          (function () {
            var form = document.getElementById('user-comment-form');
            var input = document.getElementById('user-comment-text');
            var cf = document.getElementById('comment-flash');
            var cft = document.getElementById('comment-flash-text');
            var globalFlash = document.getElementById('comment-global-flash');

            function setGlobal(kind, msg) {
              if (!globalFlash) return;
              globalFlash.textContent = msg || '';
              globalFlash.classList.remove('hidden','text-red-700','bg-red-50','ring-red-200','text-emerald-700','bg-emerald-50','ring-emerald-200','ring-1');
              globalFlash.classList.add('ring-1');
              if (kind === 'success') globalFlash.classList.add('text-emerald-700','bg-emerald-50','ring-emerald-200');
              else globalFlash.classList.add('text-red-700','bg-red-50','ring-red-200');
              clearTimeout(window.__cGlobalTimer);
              window.__cGlobalTimer = setTimeout(function(){ globalFlash.classList.add('hidden'); }, 2500);
            }

            function flash(kind, text) {
              if (!cf || !cft) return;
              cft.textContent = text || '';
              cf.classList.remove('hidden','border-red-200','bg-red-50','text-red-800','border-emerald-200','bg-emerald-50','text-emerald-800');
              if (kind === 'success') cf.classList.add('border-emerald-200','bg-emerald-50','text-emerald-800');
              else cf.classList.add('border-red-200','bg-red-50','text-red-800');
              clearTimeout(window.__commentFlashTimer);
              window.__commentFlashTimer = setTimeout(function () { cf.classList.add('hidden'); }, 2500);
            }

            function getList(){ return document.getElementById('comment-list'); }
            function getEmpty(){ return document.getElementById('comment-empty'); }

            function ensureListContainer() {
              var list = getList(), empty = getEmpty();
              if (!list) {
                list = document.createElement('ul');
                list.id = 'comment-list';
                list.className = 'space-y-3';
                var parent = empty ? empty.parentElement : null;
                if (parent) parent.replaceChildren(list);
              }
              return list;
            }

            function liHtml(dateString, id) {
              return '' +
                '<li class="rounded-xl border border-slate-200 bg-white p-4 hover:shadow-sm transition" data-id="' + (id || '') + '">' +
                  '<div class="flex gap-4 items-start justify-between">' +
                    '<div class="min-w-0 flex-1">' +
                      '<div data-role="comment-body" class="leading-relaxed whitespace-pre-wrap text-slate-800 text-[15px]"></div>' +
                      '<div class="mt-1 text-xs text-slate-500">' + dateString + '</div>' +
                    '</div>' +
                    '<div class="shrink-0 w-[260px]">' +
                      '<div class="flex items-center justify-end gap-2">' +
                        '<label class="text-xs text-slate-600">Code</label>' +
                        '<input data-role="delete-code" type="text" inputmode="numeric" pattern="[0-9]*" autocomplete="off" autocorrect="off" autocapitalize="none" spellcheck="false" name="cv_admin_delete_code" class="input h-8 w-24" placeholder="1234" aria-label="Verification code" />' +
                        '<button type="button" class="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-red-700 border border-red-300 hover:bg-red-50 active:bg-red-100 transition" data-action="delete" data-id="' + (id || '') + '" aria-label="Delete comment" title="Delete comment">' +
                          '<svg viewBox="0 0 20 20" fill="currentColor" class="h-4 w-4"><path d="M7.5 2a1 1 0 00-.894.553L6.118 4H3.5a.5.5 0 000 1h.528l.846 10.153A2 2 0 006.866 17h6.268a2 2 0 001.992-1.847L15.972 5H16.5a.5.5 0 000-1h-2.618l-.488-1.447A1 1 0 0011.5 2h-4zM8 7a.5.5 0 011 0v6a.5.5 0 01-1 0V7zm3 0a.5.5 0 011 0v6a.5.5 0 01-1 0V7z"/></svg>' +
                          'Delete' +
                        '</button>' +
                      '</div>' +
                      '<span data-role="code-error" class="mt-1 text-right text-xs px-2 py-1 rounded-md border hidden border-red-200 bg-red-50 text-red-700" aria-live="polite"></span>' +
                    '</div>' +
                  '</div>' +
                '</li>';
            }

            function prependComment(text, comment) {
              var list = ensureListContainer();
              var html = liHtml(new Date(comment && comment.createdAt ? comment.createdAt : Date.now()).toLocaleString(), comment && comment.id ? comment.id : '');
              var temp = document.createElement('div');
              temp.innerHTML = html;
              var li = temp.firstElementChild;
              var body = li && li.querySelector('[data-role="comment-body"]');
              if (body) body.textContent = text;
              if (list.firstChild) list.insertBefore(li, list.firstChild); else list.appendChild(li);
            }

            // Create
            if (form && input) {
              form.addEventListener('submit', async function (e) {
                e.preventDefault();
                var text = (input.value || '').trim();
                if (!text) { flash('error','Please enter a comment.'); return; }
                try {
                  const res = await fetch('/api/admin/users/${userId}/comments', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'same-origin',
                    body: JSON.stringify({ text })
                  });
                  const j = await res.json().catch(function(){ return {}; });
                  if (!res.ok || j.ok === false) throw new Error(j.error || 'Failed to add comment.');
                  prependComment(text, j.comment);
                  input.value = '';
                  flash('success','Comment added.');
                } catch (err) {
                  flash('error', (err && err.message) || 'Could not add comment.');
                }
              });
            }

            // Delete comment
            document.addEventListener('click', async function (e) {
              var btn = e.target && e.target.closest ? e.target.closest('[data-action="delete"]') : null;
              if (!btn) return;

              var li = btn.closest('li');
              var commentId = btn.getAttribute('data-id');
              var codeInput = li.querySelector('input[data-role="delete-code"]');
              var errSpan = li.querySelector('[data-role="code-error"]');

              function showErr(msg){ if (errSpan){ errSpan.textContent = msg; errSpan.classList.remove('hidden'); } }
              function clearErr(){ if (errSpan){ errSpan.textContent = ''; errSpan.classList.add('hidden'); } }

              var code = (codeInput && codeInput.value || '').trim();
              if (!code) { showErr('Verification code required'); return; }
              clearErr();

              try {
                const res = await fetch('/api/admin/users/${userId}/comments/' + commentId, {
                  method: 'DELETE',
                  headers: { 'Content-Type': 'application/json' },
                  credentials: 'same-origin',
                  body: JSON.stringify({ code })
                });
                const j = await res.json().catch(function(){ return {}; });

                if (!res.ok) {
                  if (j?.error === 'verification_code_required') showErr('Verification code required');
                  else if (j?.error === 'invalid_verification_code') showErr('Invalid verification code');
                  else if (j?.error === 'Admin delete code is not configured') setGlobal('error','Server not configured with delete code');
                  else showErr('Delete failed');
                  setGlobal('error','Delete failed');
                  return;
                }

                var list = document.getElementById('comment-list');
                if (li && list) {
                  list.removeChild(li);
                  if (!list.querySelector('li')) {
                    var p = document.createElement('p');
                    p.id = 'comment-empty';
                    p.className = 'text-sm opacity-80';
                    p.textContent = 'No comments yet for this user.';
                    var parent = list.parentElement;
                    if (parent) parent.replaceChildren(p);
                  }
                }
                setGlobal('success','Comment deleted.');
              } catch (err) {
                setGlobal('error','Delete failed.');
              }
            });

            // Delete user modal + validation
            if (!window.__adminUserDeleteBound) {
              window.__adminUserDeleteBound = true;

              function showModal(modal, codeInput) {
                if (modal) { modal.classList.remove('hidden'); modal.classList.add('flex'); codeInput && codeInput.focus(); }
              }
              function hideModal(modal) {
                if (modal) { modal.classList.add('hidden'); modal.classList.remove('flex'); }
              }

              // open / cancel handlers via event delegation
              document.addEventListener('click', function (e) {
                var openBtn = e.target && e.target.closest ? e.target.closest('[data-action="delete-user"],#delete-user-btn') : null;
                if (openBtn) {
                  var modal = document.getElementById('delete-user-modal');
                  var codeInput = document.getElementById('delete-user-code');
                  var errBox = document.getElementById('delete-user-error');
                  if (errBox) { errBox.textContent=''; errBox.classList.add('hidden'); }
                  if (codeInput) codeInput.value = '';
                  showModal(modal, codeInput);
                  return;
                }

                var cancelBtn = e.target && e.target.closest ? e.target.closest('#delete-user-cancel') : null;
                if (cancelBtn) {
                  hideModal(document.getElementById('delete-user-modal'));
                  return;
                }

                // backdrop click
                var backdrop = e.target && e.target.getAttribute && e.target.getAttribute('data-role') === 'backdrop';
                if (backdrop) {
                  hideModal(document.getElementById('delete-user-modal'));
                  return;
                }

                // confirm delete
                var confirmBtn = e.target && e.target.closest ? e.target.closest('#delete-user-confirm') : null;
                if (confirmBtn) {
                  var modal = document.getElementById('delete-user-modal');
                  var codeInput = document.getElementById('delete-user-code');
                  var errBox = document.getElementById('delete-user-error');

                  function showErr(msg){ if (errBox){ errBox.textContent = msg; errBox.classList.remove('hidden'); } }

                  var code = (codeInput && codeInput.value || '').trim();
                  if (!code) { showErr('Verification code required'); return; }

                  (async function(){
                    try {
                      const res = await fetch('/api/admin/users/${userId}', {
                        method: 'DELETE',
                        headers: { 'Content-Type': 'application/json' },
                        credentials: 'same-origin',
                        body: JSON.stringify({ code })
                      });
                      const j = await res.json().catch(function(){ return {}; });

                      if (!res.ok) {
                        if (j?.error === 'verification_code_required') showErr('Verification code required');
                        else if (j?.error === 'invalid_verification_code') showErr('Invalid verification code');
                        else if (j?.error === 'Admin delete code is not configured') showErr('Server not configured with delete code');
                        else showErr(j?.error || 'Delete failed');
                        return;
                      }

                      window.location.href = '/admin/users';
                    } catch {
                      showErr('Delete failed');
                    }
                  })();
                }
              });
            }
          })();
        `}
      </Script>
    </main>
  );
}

import "server-only";
import { auth } from "@repo/auth/server";
import { headers } from "next/headers";
import { Svix } from "svix";
import { keys } from "../keys";

const svixToken = keys().SVIX_TOKEN;

export const send = async (eventType: string, payload: object) => {
  if (!svixToken) {
    throw new Error("SVIX_TOKEN is not set");
  }

  const svix = new Svix(svixToken);
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return;
  }

  // Use user ID as the app identifier
  const appId = session.user.id;

  return svix.message.create(appId, {
    eventType,
    payload: {
      eventType,
      ...payload,
    },
    application: {
      name: appId,
      uid: appId,
    },
  });
};

export const getAppPortal = async () => {
  if (!svixToken) {
    throw new Error("SVIX_TOKEN is not set");
  }

  const svix = new Svix(svixToken);
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return;
  }

  // Use user ID as the app identifier
  const appId = session.user.id;

  return svix.authentication.appPortalAccess(appId, {
    application: {
      name: appId,
      uid: appId,
    },
  });
};

import React from "react";
import { Button } from "@fluentui/react-northstar";
import { useGraph } from "./lib/useGraph";
import { ProfileCard } from "./ProfileCard";

export function Graph() {
  const { loading, error, data, reload } = useGraph(
    async (graph) => {
      const profile = await graph.api("/me").get();
      const groups = await graph.api("/me/transitiveMemberOf/microsoft.graph.group?$count=true").get();
      let photoUrl = "";
      try {
        const photo = await graph.api("/me/photo/$value").get();
        photoUrl = URL.createObjectURL(photo);
      } catch {
        // Could not fetch photo from user's profile, return empty string as placeholder.
      }
      return { profile, photoUrl, groups };
    },
    { scope: ["User.Read"] }
  );

  return (
    <div>
      <h2>Get the user's profile photo</h2>
      <p>Click below to authorize this app to read your profile photo using Microsoft Graph.</p>
      <Button primary content="Authorize" disabled={loading} onClick={reload} />
      {loading && ProfileCard(true)}
      {!loading && error && (
        <div className="error">
          Failed to read your profile. Please try again later. <br /> Details: {error.toString()}
        </div>
      )}
      {!loading && data && ProfileCard(false, data)}
      <pre>{!loading && data && JSON.stringify(data.groups.value.map(i=>i.id), null, 2)}</pre>
    </div>
  );
}

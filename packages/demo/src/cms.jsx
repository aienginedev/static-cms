import cms, { useMediaAsset } from "@staticcms/core";

import "@staticcms/core/dist/main.css";

// Register all the things
cms.init();

const PostPreview = ({ entry, widgetFor }) => {
  return (
    <div>
      <div className="cover">
        <h1>{entry.data.title}</h1>
        {widgetFor("image")}
      </div>
      <p>
        <small>Written {entry.data.date}</small>
      </p>
      <div className="text">{widgetFor("body")}</div>
    </div>
  );
};

const PostPreviewCard = ({ entry, theme, hasLocalBackup }) => {
  const date = new Date(entry.data.date);

  const month = date.getMonth() + 1;
  const day = date.getDate();

  const image = entry.data.image;

  return (
    <div style={{ width: "100%" }}>
      <div
        style={{
          width: "100%",
          borderTopLeftRadius: "8px",
          borderTopRightRadius: "8px",
          overflow: "hidden",
          height: "140px",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          objectFit: "cover",
          backgroundImage: `url('${image}')`,
        }}
      />
      <div style={{ padding: "16px", width: "100%" }}>
        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
            alignItems: "start",
            gap: "4px",
            color: theme === "dark" ? "white" : "inherit",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "baseline",
              gap: "4px",
            }}
          >
            <div
              style={{
                fontSize: "14px",
                fontWeight: 700,
                color: "rgb(107, 114, 128)",
                lineHeight: "18px",
              }}
            >
              {entry.data.title}
            </div>
            <span style={{ fontSize: "14px" }}>{`${date.getFullYear()}-${month < 10 ? `0${month}` : month}-${
              day < 10 ? `0${day}` : day
            }`}</span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              whiteSpace: "no-wrap",
              gap: "8px",
            }}
          >
            {hasLocalBackup ? (
              <div
                style={{
                  border: "2px solid rgb(147, 197, 253)",
                  borderRadius: "50%",
                  color: "rgb(147, 197, 253)",
                  height: "18px",
                  width: "18px",
                  fontWeight: "bold",
                  fontSize: "11px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                }}
                title="Has local backup"
              >
                i
              </div>
            ) : null}
            <div
              style={{
                backgroundColor: entry.data.draft === true ? "rgb(37, 99, 235)" : "rgb(22, 163, 74)",
                color: "white",
                border: "none",
                padding: "2px 6px",
                textAlign: "center",
                textDecoration: "none",
                display: "inline-block",
                cursor: "pointer",
                borderRadius: "4px",
                fontSize: "14px",
              }}
            >
              {entry.data.draft === true ? "Draft" : "Published"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PostDateFieldPreview = ({ value }) => {
  const date = new Date(value);

  const month = date.getMonth() + 1;
  const day = date.getDate();

  return <div>{`${date.getFullYear()}-${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day}`}</div>;
};

const PostDraftFieldPreview = ({ value }) => {
  return (
    <div
      style={{
        backgroundColor: value === true ? "rgb(37 99 235)" : "rgb(22 163 74)",
        color: "white",
        border: "none",
        padding: "2px 6px",
        textAlign: "center",
        textDecoration: "none",
        display: "inline-block",
        cursor: "pointer",
        borderRadius: "4px",
        fontSize: "14px",
        lineHeight: "16px",
        height: "20px",
      }}
    >
      {value === true ? "Draft" : "Published"}
    </div>
  );
};

const GeneralPreview = ({ widgetsFor, entry }) => {
  const title = entry.data.site_title;
  const posts = entry.data.posts;
  const thumb = posts && posts.thumb;

  const thumbUrl = useMediaAsset(thumb);

  return (
    <div>
      <h1>{title}</h1>
      <dl>
        <dt>Posts on Frontpage</dt>
        <dd>{widgetsFor("posts").widgets.front_limit ?? 0}</dd>
      </dl>
      <dl>
        <dt>Default Author</dt>
        <dd>{widgetsFor("posts").data?.author ?? "None"}</dd>
      </dl>
      <dl>
        <dt>Default Thumbnail</dt>
        <dd>{thumb && <img src={thumbUrl} />}</dd>
      </dl>
    </div>
  );
};

const AuthorsPreview = ({ widgetsFor }) => {
  return (
    <div>
      <h1>Authors</h1>
      {widgetsFor("authors").map((author, index) => (
        <div key={index}>
          <hr />
          <strong>{author.data.name}</strong>
          {author.widgets.description}
        </div>
      ))}
    </div>
  );
};

const RelationKitchenSinkPostPreview = ({ fieldsMetaData }) => {
  // When a post is selected from the relation field, all of it's data
  // will be available in the field's metadata nested under the collection
  // name, and then further nested under the value specified in `value_field`.
  // In this case, the post would be nested under "posts" and then under
  // the title of the selected post, since our `value_field` in the config
  // is "title".
  const post = fieldsMetaData && fieldsMetaData.posts.value;

  if (!post) {
    return null;
  }

  return (
    <div style={{ border: "2px solid #ccc", borderRadius: "8px", padding: "20px" }}>
      <h2>Related Post</h2>
      <h3>{post.title}</h3>
      <img src={post.image} />
      <p>{(post.body ?? "").slice(0, 100) + "..."}</p>
    </div>
  );
};

const CustomPage = () => {
  return <div>I am a custom page!</div>;
};

cms.registerPreviewTemplate("posts", PostPreview);
CMS.registerPreviewCard("posts", PostPreviewCard, () => 240);
CMS.registerFieldPreview("posts", "date", PostDateFieldPreview);
CMS.registerFieldPreview("posts", "draft", PostDraftFieldPreview);
cms.registerPreviewTemplate("general", GeneralPreview);
cms.registerPreviewTemplate("authors", AuthorsPreview);
// Pass the name of a registered control to reuse with a new widget preview.
cms.registerWidget("relationKitchenSinkPost", "relation", RelationKitchenSinkPostPreview);
cms.registerAdditionalLink({
  id: "docs",
  title: "Static CMS Docs",
  data: "https://staticcms.org",
  options: {
    icon: "page",
  },
});
cms.registerAdditionalLink({
  id: "config",
  title: "Demo config.yml",
  data: "https://github.com/StaticJsCMS/static-cms/blob/main/packages/demo/public/config.yml",
  options: {
    icon: "page",
  },
});
cms.registerAdditionalLink({
  id: "custom-page",
  title: "Custom Page",
  data: CustomPage,
  options: {
    icon: "page",
  },
});

cms.registerShortcode("youtube", {
  label: "YouTube",
  openTag: "[",
  closeTag: "]",
  separator: "|",
  toProps: (args) => {
    if (args.length > 0) {
      return { src: args[0] };
    }

    return { src: "" };
  },
  toArgs: ({ src }) => {
    return [src];
  },
  control: ({ src, onChange }) => {
    return (
      <span>
        <input
          key="control-input"
          value={src}
          onChange={(event) => {
            onChange({ src: event.target.value });
          }}
        />
        <iframe key="control-preview" width="420" height="315" src={`https://www.youtube.com/embed/${src}`} />
      </span>
    );
  },
  preview: ({ src }) => {
    return (
      <span>
        <iframe width="420" height="315" src={`https://www.youtube.com/embed/${src}`} />
      </span>
    );
  },
});

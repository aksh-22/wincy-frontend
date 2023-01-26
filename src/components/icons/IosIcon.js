import React, { useState, useRef, useEffect, memo } from "react";
import ReportGmailerrorredIcon from "@mui/icons-material/ReportGmailerrorred";
import { LightTooltip } from "components/tooltip/LightTooltip";
function Icon({ name, onCompleted, onError, style, ...rest }) {
  const { error, loading, SvgIcon } = useDynamicSVGImport(name, {
    onCompleted,
    onError,
  });

  if (error) {
    return (
      <LightTooltip title="Error on icon loading!" placement="top">
        <ReportGmailerrorredIcon style={{ color: "var(--red)" }} />
      </LightTooltip>
    );
  }
  if (loading) {
    return "";
  }
  if (SvgIcon) {
    return <SvgIcon {...rest} style={{ ...style }} />;
  }
  return null;
}

function useDynamicSVGImport(name, options = {}) {
  const ImportedIconRef = useRef();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  const { onCompleted, onError } = options;
  useEffect(() => {
    setLoading(true);

    const importIcon = async () => {
      try {
        ImportedIconRef.current = (
          await import(
            `!!@svgr/webpack?-svgo,+titleProp,+ref!../../assets/svg/${name}.svg`
          )
        ).default;

        if (onCompleted) {
          onCompleted(name, ImportedIconRef.current);
        }
      } catch (err) {
        console.log(err, "error");
        if (onError) {
          onError(err);
        }
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    importIcon();
  }, [name, onCompleted, onError]);

  return { error, loading, SvgIcon: ImportedIconRef.current };
}

export default memo(Icon);

import React, { useState } from 'react';
import { trpc } from '../../../api/trpc';
import { useAllowEdit } from './useAllowEdit';
import {
  MonitorStatusPageEditForm,
  MonitorStatusPageEditFormValues,
} from './EditForm';
import clsx from 'clsx';
import { useRequest } from '../../../hooks/useRequest';
import { ColorSchemeSwitcher } from '../../ColorSchemeSwitcher';
import { StatusPageServices } from './Services';
import { useTranslation } from '@i18next-toolkit/react';
import { Link, useNavigate } from '@tanstack/react-router';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';

interface MonitorStatusPageProps {
  slug: string;
  showBackBtn?: boolean;
}

export const MonitorStatusPage: React.FC<MonitorStatusPageProps> = React.memo(
  (props) => {
    const { t } = useTranslation();
    const { slug, showBackBtn = true } = props;

    const { data: info } = trpc.monitor.getPageInfo.useQuery({
      slug,
    });
    const editPageMutation = trpc.monitor.editPage.useMutation();
    const trpcUtils = trpc.useUtils();
    const navigate = useNavigate();

    const allowEdit = useAllowEdit(info?.workspaceId);
    const [editMode, setEditMode] = useState(() => {
      return new URLSearchParams(window.location.search).has('edit');
    });

    const monitorList = info?.monitorList ?? [];

    const [{ loading }, handleSave] = useRequest(
      async (values: MonitorStatusPageEditFormValues) => {
        if (!info) {
          return;
        }

        const newPageInfo = await editPageMutation.mutateAsync({
          id: info.id,
          workspaceId: info.workspaceId,
          ...values,
        });

        trpcUtils.monitor.getPageInfo.setData(
          {
            slug,
          },
          newPageInfo
        );
        setEditMode(false);

        if (info.slug !== newPageInfo.slug) {
          // if slug is changed, should to navigate to new url
          navigate({
            to: '/status/$slug',
            params: {
              slug: newPageInfo.slug,
            },
            replace: true,
          });
        }
      }
    );

    return (
      <div className="flex h-full w-full">
        <Helmet>
          <title>
            {info?.title}
            {info?.description && ` | ${info?.description}`}
          </title>
        </Helmet>

        {editMode && (
          <div className="w-1/3 overflow-auto border-r border-gray-300 px-4 py-8 dark:border-gray-600">
            <MonitorStatusPageEditForm
              isLoading={loading}
              initialValues={info ?? {}}
              onFinish={handleSave}
              onCancel={() => setEditMode(false)}
            />
          </div>
        )}

        <div
          className={clsx(
            'mx-auto overflow-auto px-4 py-8',
            !editMode ? 'w-4/5' : 'w-2/3'
          )}
        >
          <div className="flex">
            <div className="mb-4 flex-1 text-2xl">{info?.title}</div>

            <ColorSchemeSwitcher />
          </div>

          {allowEdit && !editMode && (
            <div className="mb-4 flex gap-2">
              <Button onClick={() => setEditMode(true)}>{t('Edit')}</Button>

              {showBackBtn && (
                <Link to="/">
                  <Button variant="outline">{t('Back to Admin')}</Button>
                </Link>
              )}
            </div>
          )}

          <div className="mb-2 text-lg">{t('Services')}</div>

          {info && (
            <StatusPageServices
              workspaceId={info.workspaceId}
              monitorList={monitorList}
            />
          )}
        </div>
      </div>
    );
  }
);
MonitorStatusPage.displayName = 'MonitorStatusPage';
